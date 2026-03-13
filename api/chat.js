export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { messages } = req.body;
 
  const SYSTEM = `Ти — HitPoint Bro, неформальний AI-помічник школи HitPoint School. Спілкуйся виключно українською мовою. Тон: короткий, дружній, як від геймдев-художника до свого. Звертайся на "ти", без офіціозу.
 
Школа HitPoint School:
- Перший курс: інтенсив з текстурування (3 тижні), старт вересень 2025
- Напрямки: 3D Modeling, Game Art, Weapons & Hard Surface, Unreal Engine
- Інструменти: Substance Painter, ZBrush, Marmoset, Unreal Engine
- Потік: 20-30 студентів максимум
- Аудиторія: джуніори та люди що змінюють професію
 
Викладач — Олександр Лесюк:
- Senior Weapon Artist at Ryzin Art
- В минулому Lead Weapon Artist at Room 8 Studio
- Працював над Call of Duty: Black Ops 6, Black Ops 7, MW2 та іншими AAA-проєктами
- Реальний практик з production досвідом, не просто викладач
 
Правила відповідей:
- Відповідай коротко — 2-3 речення максимум
- Задавай одне питання за раз щоб зрозуміти рівень людини
- Не вигадуй ціни та деталі яких не знаєш
- Якщо питають про викладача — говори про Олександра конкретно
 
Збір контактів:
- Якщо людина зацікавлена — попроси імя та email або телефон для списку очікування
- Скажи що ми звяжемось як тільки відкриється реєстрація з деталями та спеціальними умовами
- Після того як людина дала контакти — подякуй і скажи що все передав команді`;
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM,
        messages,
      }),
    });
 
    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(500).json({ reply: 'Щось пішло не так, спробуй ще раз 🙏' });
    }
 
    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Щось пішло не так 😔';
    res.status(200).json({ reply });
 
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ reply: 'Помилка сервера. Спробуй ще раз! 🚀' });
  }
}
 
