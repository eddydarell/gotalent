<template>
  <v-card-text class="text-center pt-4 countdown-container" :class="countdownClass">
    <div >
      <v-icon :icon="isUrgent ? 'mdi-clock-alert' : 'mdi-clock-outline'" class="mr-1 countdown-icon" />
      {{ isExpired ? 'Délai d\'inscription expiré' : 'Temps restant pour s\'inscrire' }}
    </div>
    
    <div v-if="!isExpired" class="d-flex justify-center align-center countdown-display">
      <div class="mx-2 text-center countdown-unit">
        <div class="countdown-number-box">
          <div class="countdown-number">
            <transition name="roll" mode="out-in">
              <span :key="timeLeft.days">{{ timeLeft.days }}</span>
            </transition>
          </div>
        </div>
        <div class="countdown-label">Jours</div>
      </div>
      
      <div class="countdown-separator">|</div>
      
      <div class="mx-2 text-center countdown-unit">
        <div class="countdown-number-box">
          <div class="countdown-number">
            <transition name="roll" mode="out-in">
              <span :key="timeLeft.hours">{{ timeLeft.hours }}</span>
            </transition>
          </div>
        </div>
        <div class="countdown-label">Heures</div>
      </div>
      
      <div class="countdown-separator">|</div>
      
      <div class="mx-2 text-center countdown-unit">
        <div class="countdown-number-box">
          <div class="countdown-number">
            <transition name="roll" mode="out-in">
              <span :key="timeLeft.minutes">{{ timeLeft.minutes }}</span>
            </transition>
          </div>
        </div>
        <div class="countdown-label">Minutes</div>
      </div>
      
      <div class="countdown-separator">|</div>
      
      <div class="mx-2 text-center countdown-unit">
        <div class="countdown-number-box">
          <div class="countdown-number">
            <transition name="roll" mode="out-in">
              <span :key="timeLeft.seconds">{{ timeLeft.seconds }}</span>
            </transition>
          </div>
        </div>
        <div class="countdown-label">Secondes</div>
      </div>
    </div>
    
    <div v-else class="text-h6 expired-message">
      <v-icon icon="mdi-alert-circle" class="mr-2" />
      L'inscription n'est plus possible
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  deadline: Date
}

const props = defineProps<Props>()

const now = ref(new Date())
let interval: NodeJS.Timeout | null = null

const timeLeft = computed(() => {
  const diff = props.deadline.getTime() - now.value.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  }
})

const isExpired = computed(() => {
  return props.deadline.getTime() <= now.value.getTime()
})

const isUrgent = computed(() => {
  const diff = props.deadline.getTime() - now.value.getTime()
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
  return diff <= threeDaysInMs && diff > 0
})

const countdownClass = computed(() => ({
  'countdown-urgent': isUrgent.value,
  'countdown-normal': !isUrgent.value && !isExpired.value,
  'countdown-expired': isExpired.value
}))

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.countdown-container {
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.1), rgba(255, 215, 0, 0.1));
  border: 2px solid rgba(184, 134, 11, 0.2);
  position: relative;
  overflow: hidden;
}

.v-theme--dark .countdown-container {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 160, 0, 0.1));
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.countdown-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  animation: shimmer 10s ease-in-out infinite;
}

.countdown-urgent {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 193, 7, 0.2)) !important;
  border-color: rgba(255, 152, 0, 0.4) !important;
  animation: pulse-urgent 2s ease-in-out infinite;
}

.countdown-expired {
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.1), rgba(244, 67, 54, 0.1)) !important;
  border-color: rgba(211, 47, 47, 0.3) !important;
}

.countdown-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  text-transform: uppercase;
  letter-spacing: 1px;
}

.countdown-icon {
  color: rgb(var(--v-theme-primary));
  font-size: 1rem;
  margin-bottom: .2rem;
}

.countdown-display {
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
}

.countdown-unit {
  min-width: 80px;
}

.countdown-number-box {
  color: var(--v-theme-on-surface);
  background: #fff;
  border-radius: 50%;
  padding: 0.8rem 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(184, 134, 11, 0.3);
  position: relative;
  overflow: hidden;
}

/* Responsive styles for mobile devices */
@media (max-width: 600px) {
  .countdown-container {
    padding: 0.5rem !important;
  }
  
  .countdown-display {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  
  .countdown-unit {
    min-width: 50px;
    flex: 0 1 auto;
  }
  
  .countdown-number-box {
    padding: 0.4rem 0.3rem;
    margin-bottom: 0.3rem;
  }
  
  .countdown-number {
    font-size: 1rem;
    height: 1.5em;
  }
  
  .countdown-label {
    font-size: 0.65rem;
  }
  
  .countdown-separator {
    font-size: 1.2rem;
    margin: 0 0.05rem;
  }
  
  .countdown-icon {
    font-size: 0.9rem;
  }
}

.v-theme--dark .countdown-number-box {
  background: linear-gradient(135deg, #1A1611, #2C1E14);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2),
              inset 0 1px 0 rgba(255, 215, 0, 0.1);
}

.countdown-number-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.countdown-number {
  position: relative;
  overflow: hidden;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A1611;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.v-theme--dark .countdown-number {
  color: #FFD700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.countdown-label {
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
}

.countdown-separator {
  font-size: 2rem;
  font-weight: 400;
  color: rgb(var(--v-theme-primary));
  margin: 0 0.1rem;
}

.expired-message {
  color: rgb(var(--v-theme-error));
  font-weight: 600;
  animation: fade-pulse 2s ease-in-out infinite;
}

/* Animations */
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes number-shimmer {
  0% { left: -100%; }
  50% { left: -100%; }
  100% { left: 100%; }
}

@keyframes pulse-urgent {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes fade-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Transition animations */
.roll-enter-active,
.roll-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.roll-enter-from {
  transform: translateY(-100%) rotateX(90deg);
  opacity: 0;
}

.roll-leave-to {
  transform: translateY(100%) rotateX(-90deg);
  opacity: 0;
}

.roll-enter-to,
.roll-leave-from {
  transform: translateY(0) rotateX(0deg);
  opacity: 1;
}

/* Responsive styles for mobile devices */
@media (max-width: 600px) {
  .countdown-container {
    padding: 0.5rem !important;
  }
  
  .countdown-display {
    font-size: 1rem;
    margin: 0.5rem 0;
    flex-wrap: nowrap;
    gap: 0.2rem;
    justify-content: space-between;
  }
  
  .countdown-unit {
    min-width: auto;
    flex: 1;
    margin: 0 0.1rem !important;
  }
  
  .countdown-number-box {
    padding: 0.3rem 0.2rem;
    margin-bottom: 0.2rem;
    border-radius: 8px !important;
    box-shadow: 0 2px 4px rgba(184, 134, 11, 0.2) !important;
    border: 1px solid rgba(184, 134, 11, 0.3) !important;
  }
  
  .countdown-number {
    font-size: 0.9rem;
    height: auto;
    font-weight: 700;
  }
  
  .countdown-label {
    font-size: 0.6rem;
    margin-top: 0.1rem;
  }
  
  .countdown-separator {
    font-size: 1rem;
    margin: 0 0.05rem;
    align-self: center;
    margin-top: -1rem;
  }
  
  .countdown-icon {
    font-size: 0.8rem;
  }
}

/* Extra small screens (XS) */
@media (max-width: 420px) {
  .countdown-container {
    padding: 0.25rem !important;
  }
  
  .countdown-display {
    font-size: 0.85rem;
    margin: 0.25rem 0;
    gap: 0.1rem;
  }
  
  .countdown-unit {
    margin: 0 !important;
  }
  
  .countdown-number-box {
    padding: 0.2rem 0.1rem;
    margin-bottom: 0.15rem;
    border-radius: 6px !important;
  }
  
  .countdown-number {
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .countdown-label {
    font-size: 0.55rem;
  }
  
  .countdown-separator {
    font-size: 0.8rem;
  }
  
  .countdown-icon {
    font-size: 0.7rem;
  }
}
</style>
