// Mock temporário para navegação até resolvermos as dependências
export const useNavigation = () => ({
  navigate: (screen: string, params?: any) => {
    console.log(`Navigate to ${screen}`, params)
  },
  goBack: () => {
    console.log('Go back')
  }
})

export const useFocusEffect = (callback: () => void) => {
  // Mock - executa o callback imediatamente
  callback()
}

export const useRoute = () => ({
  params: {}
})
