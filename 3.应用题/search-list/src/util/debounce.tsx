export const debounce = function debounce(func: Function, wait = 166) {
    let timeout: ReturnType<typeof setTimeout>;
    function debounced(...args: any) {
      
  
          const later = () => {
              //@ts-ignore
              func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  
    }
  
    debounced.clear = () => {
      clearTimeout(timeout);
    };
  
    return debounced;
  }
  