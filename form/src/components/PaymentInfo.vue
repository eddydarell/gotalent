<template>
  <v-card class="payment-info-card elevation-2">
    <v-card-text class="pa-4">
      <v-row align="center" class="mb-2">
        <v-col>
          <h3 class="text-h6 text-center font-weight-bold gold--text">
            Participation à seulement 100 USD
          </h3>
        </v-col>
      </v-row>
      
      <v-divider class="mb-3" />
      
      <p class="text-body-1 mb-3">
        La participation à cet événement revient à un coût de <strong class="text-h6 amber-darken-4--text">100 USD</strong> 
        (Cent Dollars Américains) par participant.
      </p>
      
      <p class="text-body-2 mb-3">
        Le paiement doit être effectué <strong class="text-h6 amber-darken-4--text">avant le 10 Novembre 2025</strong> via l'un des modes de paiement suivants :
      </p>
      
      <!-- Payment Methods Table -->
      <v-table class="payment-methods-table">
        <tbody>
          <tr class="payment-method-row">
            <td class="logo-cell">
              <v-img 
                src="assets/illicocash.png"
                alt="Illicocash" 
                max-width="150"
                max-height="150"
                class="mx-auto logo-image"
              />
            </td>
            <td class="method-name-cell">
              <span class="method-name">Illicocash</span>
            </td>
            <td class="phone-cell">
              <div class="phone-number-wrapper" @click="copyPhoneNumber('+243979599006')">
                <span class="phone-number">+243979599006</span>
                <v-icon 
                  :icon="copiedNumber === '+243979599006' ? 'mdi-check' : 'mdi-content-copy'" 
                  size="small" 
                  :color="copiedNumber === '+243979599006' ? 'success' : 'grey'"
                  class="copy-icon"
                />
              </div>
            </td>
          </tr>
          
          <tr class="payment-method-row">
            <td class="logo-cell">
              <v-img 
                src="assets/airtel_money.png" 
                alt="Airtel Money" 
                class="mx-auto logo-image"
                max-width="150"
                max-height="150"
              />
            </td>
            <td class="method-name-cell">
              <span class="method-name">Airtel Money ou Equity</span>
            </td>
            <td class="phone-cell">
              <div class="phone-number-wrapper" @click="copyPhoneNumber('+243994215290')">
                <span class="phone-number">+243994215290</span>
                <v-icon 
                  :icon="copiedNumber === '+243994215290' ? 'mdi-check' : 'mdi-content-copy'" 
                  size="small" 
                  :color="copiedNumber === '+243994215290' ? 'success' : 'grey'"
                  class="copy-icon"
                />
              </div>
            </td>
          </tr>
          
          <tr class="payment-method-row">
            <td class="logo-cell">
              <v-img 
                src="assets/mpesa.png" 
                alt="Mpesa" 
                class="mx-auto logo-image"
                max-width="150"
                max-height="150"
              />
            </td>
            <td class="method-name-cell">
              <span class="method-name">Mpesa</span>
            </td>
            <td class="phone-cell">
              <div class="phone-number-wrapper" @click="copyPhoneNumber('+243823817473')">
                <span class="phone-number">+243823817473</span>
                <v-icon 
                  :icon="copiedNumber === '+243823817473' ? 'mdi-check' : 'mdi-content-copy'" 
                  size="small" 
                  :color="copiedNumber === '+243823817473' ? 'success' : 'grey'"
                  class="copy-icon"
                />
              </div>
            </td>
          </tr>
          
          <tr class="payment-method-row">
            <td class="logo-cell">
              <v-img 
                src="assets/orange_money.png" 
                alt="Orange Money" 
                class="mx-auto logo-image"
                max-width="150"
                max-height="150"
              />
            </td>
            <td class="method-name-cell">
              <span class="method-name">Orange Money</span>
            </td>
            <td class="phone-cell">
              <div class="phone-number-wrapper" @click="copyPhoneNumber('+243853082388')">
                <span class="phone-number">+243853082388</span>
                <v-icon 
                  :icon="copiedNumber === '+243853082388' ? 'mdi-check' : 'mdi-content-copy'" 
                  size="small" 
                  :color="copiedNumber === '+243853082388' ? 'success' : 'grey'"
                  class="copy-icon"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      
      <v-alert
        type="info"
        variant="tonal"
        density="compact"
        class="mt-3"
        icon="mdi-information"
      >
        Veuillez conserver votre preuve de paiement pour présentation lors de l'événement.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const copiedNumber = ref<string | null>(null)

const copyPhoneNumber = async (phoneNumber: string) => {
  try {
    await navigator.clipboard.writeText(phoneNumber)
    copiedNumber.value = phoneNumber
    
    // Reset the checkmark after 2 seconds
    setTimeout(() => {
      copiedNumber.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy phone number:', err)
  }
}
</script>

<style scoped>
.payment-info-card {
  border-left: 4px solid #F57F17;
}

.payment-methods-table {
  background: transparent !important;
  margin-bottom: 0;
}

.payment-methods-table tbody {
  background: transparent !important;
}

.payment-method-row {
  transition: all 0.2s ease;
}

.payment-method-row:hover {
  background: rgba(255, 193, 7, 0.1);
}

.logo-cell {
  width: 80px;
  padding: 12px 8px !important;
  vertical-align: middle;
  text-align: center;
}

.payment-logo {
  display: inline-block;
  object-fit: contain;
}

.method-name-cell {
  padding: 12px 16px !important;
  vertical-align: middle;
  width: 50%;
}

.method-name {
  font-weight: 500;
  font-size: 1rem;
}

.phone-cell {
  padding: 12px 16px !important;
  vertical-align: middle;
  text-align: left;
}

.phone-number-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.phone-number-wrapper:hover {
  background: rgba(255, 193, 7, 0.15);
}

.phone-number-wrapper:active {
  transform: scale(0.98);
}

.phone-number {
  color: #F57F17;
  font-weight: bold;
  font-size: 1.5em;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

.copy-icon {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.phone-number-wrapper:hover .copy-icon {
  opacity: 1;
}

.amber-darken-4--text {
  color: #FF6F00;
}

/* Dark theme support */
.v-theme--dark .payment-method-row:hover {
  background: rgba(255, 193, 7, 0.15);
}
</style>
