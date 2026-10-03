const fs = require('fs');
const langs = ['en', 'uz', 'ru'];
for (const lang of langs) {
  const file = 'src/locales/' + lang + '.json';
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!data.contact) data.contact = {};
  
  if (lang === 'en') {
    data.contact.address = 'Amir Temur avenue 108,<br/>Tashkent, Uzbekistan';
    data.contact.hours = 'Mon-Sat: 10:00 - 20:00<br/>Sun: Closed';
  } else if (lang === 'uz') {
    data.contact.address = 'Amir Temur shoh ko\'chasi 108,<br/>Toshkent, O\'zbekiston';
    data.contact.hours = 'Dush-Shan: 10:00 - 20:00<br/>Yak: Yopiq';
  } else {
    data.contact.address = 'пр. Амира Темура 108,<br/>Ташкент, Узбекистан';
    data.contact.hours = 'Пн-Сб: 10:00 - 20:00<br/>Вс: Выходной';
  }
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
