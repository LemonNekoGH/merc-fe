declare interface Window {
  ethereum?: import('ethers').BrowserProvider
}

declare interface ImportMetaEnv {
  readonly VITE_APP_API_BASE_URL: string
}
