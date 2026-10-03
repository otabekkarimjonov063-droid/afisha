const fs = require('fs');

const langs = ['en', 'uz', 'ru'];
for (const lang of langs) {
  const file = 'src/locales/' + lang + '.json';
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (lang === 'en') {
    data.login = {
      welcome: "Welcome Back",
      create_account: "Create an Account",
      welcome_desc: "Enter your details to access your account.",
      create_desc: "Join us to buy and collect event posters.",
      login_tab: "Log In",
      register_tab: "Register",
      use_username: "Use Username",
      use_phone: "Use Phone",
      full_name: "Full Name",
      username: "Username",
      phone: "Phone Number",
      password: "Password",
      create_btn: "Create Account",
      login_btn: "Log In",
      demo_admin: "Demo Admin: username admin / password admin123",
      err_password: "Password must be at least 6 characters",
      err_invalid: "Invalid credentials",
      err_taken_user: "Username already taken",
      err_taken_phone: "Phone number already registered",
      succ_login: "Logged in successfully!",
      succ_reg: "Registered successfully!"
    };
    data.profile = {
      title: "Profile",
      my: "My",
      logout: "Logout",
      history: "Order History",
      order: "Order",
      items: "Items",
      size: "Size",
      no_orders: "You haven't placed any orders yet."
    };
    data.contact = {
      title: "Contact",
      get_in: "Get in",
      touch: "Touch",
      desc: "Have a question about a poster, shipping, or need a custom size? We're here to help.",
      info: "Contact Information",
      email_us: "Email Us",
      call_us: "Call Us",
      visit_us: "Visit Us",
      send_msg: "Send a Message",
      name: "Your Name",
      email: "Email Address",
      message: "Message",
      send_btn: "Send Message",
      succ_msg: "Message sent successfully!"
    };
  } else if (lang === 'uz') {
    data.login = {
      welcome: "Xush kelibsiz",
      create_account: "Hisob yaratish",
      welcome_desc: "Hisobingizga kirish uchun ma'lumotlarni kiriting.",
      create_desc: "Afishalar sotib olish va yig'ish uchun bizga qo'shiling.",
      login_tab: "Kirish",
      register_tab: "Ro'yxatdan o'tish",
      use_username: "Login orqali",
      use_phone: "Telefon orqali",
      full_name: "To'liq ismingiz",
      username: "Login (Username)",
      phone: "Telefon raqam",
      password: "Parol",
      create_btn: "Hisob yaratish",
      login_btn: "Kirish",
      demo_admin: "Demo Admin: username admin / password admin123",
      err_password: "Parol kamida 6 belgidan iborat bo'lishi kerak",
      err_invalid: "Noto'g'ri login yoki parol",
      err_taken_user: "Bu login band",
      err_taken_phone: "Bu telefon raqam ro'yxatdan o'tgan",
      succ_login: "Muvaffaqiyatli kirdingiz!",
      succ_reg: "Muvaffaqiyatli ro'yxatdan o'tdingiz!"
    };
    data.profile = {
      title: "Profil",
      my: "Mening",
      logout: "Chiqish",
      history: "Buyurtmalar tarixi",
      order: "Buyurtma",
      items: "Mahsulotlar",
      size: "O'lcham",
      no_orders: "Siz hali hech qanday buyurtma bermagansiz."
    };
    data.contact = {
      title: "Aloqa",
      get_in: "Biz bilan",
      touch: "Bog'lanish",
      desc: "Afisha, yetkazib berish yoki maxsus o'lcham haqida savolingiz bormi? Biz yordam berishga tayyormiz.",
      info: "Aloqa ma'lumotlari",
      email_us: "Elektron pochta",
      call_us: "Telefon qiling",
      visit_us: "Tashrif buyuring",
      send_msg: "Xabar yuborish",
      name: "Ismingiz",
      email: "Email manzilingiz",
      message: "Xabar matni",
      send_btn: "Xabarni yuborish",
      succ_msg: "Xabar muvaffaqiyatli yuborildi!"
    };
  } else {
    data.login = {
      welcome: "С возвращением",
      create_account: "Создать аккаунт",
      welcome_desc: "Введите данные для входа в систему.",
      create_desc: "Присоединяйтесь к нам, чтобы покупать афиши.",
      login_tab: "Войти",
      register_tab: "Регистрация",
      use_username: "По логину",
      use_phone: "По телефону",
      full_name: "Полное имя",
      username: "Логин",
      phone: "Номер телефона",
      password: "Пароль",
      create_btn: "Создать аккаунт",
      login_btn: "Войти",
      demo_admin: "Demo Admin: username admin / password admin123",
      err_password: "Пароль должен содержать не менее 6 символов",
      err_invalid: "Неверные данные",
      err_taken_user: "Этот логин уже занят",
      err_taken_phone: "Этот телефон уже зарегистрирован",
      succ_login: "Успешный вход!",
      succ_reg: "Успешная регистрация!"
    };
    data.profile = {
      title: "Профиль",
      my: "Мой",
      logout: "Выйти",
      history: "История заказов",
      order: "Заказ",
      items: "Товары",
      size: "Размер",
      no_orders: "Вы еще не сделали ни одного заказа."
    };
    data.contact = {
      title: "Контакты",
      get_in: "Свяжитесь",
      touch: "с нами",
      desc: "Есть вопросы по поводу афиш или доставки? Мы здесь, чтобы помочь.",
      info: "Контактная информация",
      email_us: "Напишите нам",
      call_us: "Позвоните нам",
      visit_us: "Посетите нас",
      send_msg: "Отправить сообщение",
      name: "Ваше имя",
      email: "Ваш Email",
      message: "Сообщение",
      send_btn: "Отправить сообщение",
      succ_msg: "Сообщение успешно отправлено!"
    };
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
