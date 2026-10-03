const fs = require('fs');
['uz', 'ru', 'en'].forEach(lang => {
  const data = JSON.parse(fs.readFileSync('src/locales/' + lang + '.json', 'utf8'));
  
  if (lang === 'en') {
    data.cart = {
      empty_title: "Your cart is empty",
      empty_desc: "Looks like you haven't added any posters to your cart yet.",
      explore: "Explore Collection",
      your: "Your",
      title: "Cart",
      product: "Product",
      size: "Size",
      quantity: "Quantity",
      total: "Total",
      summary_title: "Order Summary",
      subtotal: "Subtotal",
      discount: "Discount",
      promo_code: "Promo Code",
      apply: "Apply",
      full_name: "Full Name",
      phone: "Phone Number",
      address: "Delivery Address",
      comment: "Comment (optional)",
      payment: "Payment Method",
      cash: "Cash",
      on_delivery: "on delivery",
      card: "Card",
      payme_click: "Payme / Click",
      place_order: "Place Order",
      promo_invalid: "Invalid promo code.",
      promo_limit: "Promo code usage limit reached.",
      promo_success: "Promo code applied!",
      fill_required: "Please fill all required fields",
      order_success: "Order placed successfully!"
    };
  } else if (lang === 'uz') {
    data.cart = {
      empty_title: "Savatchangiz bo'sh",
      empty_desc: "Aftidan, siz savatchangizga hali hech qanday afisha qo'shmagansiz.",
      explore: "Kolleksiyani ko'rish",
      your: "Sizning",
      title: "Savatchangiz",
      product: "Mahsulot",
      size: "O'lcham",
      quantity: "Soni",
      total: "Jami",
      summary_title: "Buyurtma haqida",
      subtotal: "Oraliq summa",
      discount: "Chegirma",
      promo_code: "Promo kod",
      apply: "Qo'llash",
      full_name: "To'liq ismingiz",
      phone: "Telefon raqamingiz",
      address: "Yetkazib berish manzili",
      comment: "Izoh (ixtiyoriy)",
      payment: "To'lov turi",
      cash: "Naqd",
      on_delivery: "yetkazib berganda",
      card: "Karta orqali",
      payme_click: "Payme / Click",
      place_order: "Buyurtma berish",
      promo_invalid: "Promo kod noto'g'ri.",
      promo_limit: "Promo koddan foydalanish limiti tugagan.",
      promo_success: "Promo kod qo'llanildi!",
      fill_required: "Iltimos, barcha majburiy maydonlarni to'ldiring",
      order_success: "Buyurtma muvaffaqiyatli rasmiylashtirildi!"
    };
  } else {
    data.cart = {
      empty_title: "Ваша корзина пуста",
      empty_desc: "Похоже, вы еще не добавили ни одного плаката в корзину.",
      explore: "Смотреть коллекцию",
      your: "Ваша",
      title: "Корзина",
      product: "Продукт",
      size: "Размер",
      quantity: "Кол-во",
      total: "Итого",
      summary_title: "Детали заказа",
      subtotal: "Сумма",
      discount: "Скидка",
      promo_code: "Промокод",
      apply: "Применить",
      full_name: "Полное имя",
      phone: "Номер телефона",
      address: "Адрес доставки",
      comment: "Комментарий (необязательно)",
      payment: "Способ оплаты",
      cash: "Наличными",
      on_delivery: "при доставке",
      card: "Карта",
      payme_click: "Payme / Click",
      place_order: "Оформить заказ",
      promo_invalid: "Неверный промокод.",
      promo_limit: "Лимит исчерпан.",
      promo_success: "Промокод применен!",
      fill_required: "Заполните обязательные поля",
      order_success: "Заказ успешно оформлен!"
    };
  }
  
  fs.writeFileSync('src/locales/' + lang + '.json', JSON.stringify(data, null, 2));
});
