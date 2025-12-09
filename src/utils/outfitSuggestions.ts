export const getOutfitSuggestion = (temp: number, condition: string): { outfit: string; items: string[] } => {
  const c = condition.toLowerCase();
  
  if (temp < 32) {
    return {
      outfit: 'Bundle Up!',
      items: ['🧥 Heavy winter coat', '🧤 Gloves', '🧣 Scarf', '👢 Boots']
    };
  }
  
  if (temp >= 32 && temp < 50) {
    return {
      outfit: 'Layer Up',
      items: ['🧥 Jacket', '👕 Long sleeves', '👖 Jeans', c.includes('rain') ? '☂️ Umbrella' : '👟 Sneakers']
    };
  }
  
  if (temp >= 50 && temp < 65) {
    return {
      outfit: 'Light Layers',
      items: ['🧥 Light jacket', '👕 T-shirt', '👖 Pants', '👟 Comfortable shoes']
    };
  }
  
  if (temp >= 65 && temp < 75) {
    return {
      outfit: 'Casual Comfort',
      items: ['👕 T-shirt', '🩳 Shorts or jeans', '👟 Sneakers', c.includes('sun') ? '🕶️ Sunglasses' : '🧢 Cap']
    };
  }
  
  if (temp >= 75 && temp < 85) {
    return {
      outfit: 'Stay Cool',
      items: ['👕 Light shirt', '🩳 Shorts', '👡 Sandals', '🕶️ Sunglasses']
    };
  }
  
  return {
    outfit: 'Beat the Heat',
    items: ['👕 Tank top', '🩳 Shorts', '👡 Flip flops', '🕶️ Sunglasses', '🧴 Sunscreen']
  };
};
