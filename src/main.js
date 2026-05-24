import { createApp } from 'vue'
import App from './App.vue'

window.CARDMOBILE_ENV = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}

createApp(App).mount('#app')
