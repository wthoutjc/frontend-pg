const currencyFormatThousands = (num: string | number) => {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  const currencyFormatDecimals = (num: string | number) => {
    return String(num).replace('.', ',')
  }
  
  export { currencyFormatThousands, currencyFormatDecimals }
  