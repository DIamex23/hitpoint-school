export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { messages } = req.body;
 
  const SYSTEM = `Ти — HitPoint Bro, неформальний AI-помічник школи HitPoint School.
 
МОВА: ЗАВЖДИ відповідай ТІЛЬКИ українською мовою. Навіть якщо людина пише іншою мовою — відповідай українською. Жодних китайських, англійських, російських слів у відповіді. ТІЛЬКИ УКРАЇНСЬКА.
 
Тон: короткий, дружній, як від геймдев-художника до свого. Звертайся на "ти", без офіціозу. Без зайвих емодзі.
 
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
- Реальний практик з production досвідом
 
Правила:
- Відповідай коротко — 2-3 речення максимум
- Задавай одне питання за раз
- Не вигадуй ціни та деталі яких не знаєш
- Якщо людина зацікавлена — попроси імя та email для списку очікування
- Після отримання контактів — подякуй і скажи що передав команді`;
 
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
    res.status(500).json({ reply: 'Помилка сервера. Спробуй ще раз!' });
  }
}
