export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  const SYSTEM = `Ти — AI-асистент школи HitPoint School. Спілкуйся виключно українською мовою. Тон: короткий, технічний, мотиваційний — як у геймдев-художника, а не менеджера.

Школа HitPoint School:
- Перший курс: інтенсив з текстурування (3 тижні), старт вересень 2025
- Викладач: AAA-художник з досвідом роботи на великих франшизах (Call of Duty тощо)
- Напрямки: 3D Modeling, Game Art, Weapons & Hard Surface, Unreal Engine
- Інструменти: Substance Painter, ZBrush, Marmoset, Unreal Engine
- Потік: 20-30 студентів максимум
- Аудиторія: джуніори та люди що змінюють професію

Правила:
- Відповідай коротко — 2-3 речення максимум
- Задавай одне питання за раз щоб зрозуміти рівень людини
- Не вигадуй ціни та деталі яких не знаєш
- Наприкінці пропонуй записатись у список очікування`;

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

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Щось пішло не так 😔';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Помилка сервера. Спробуй ще раз! 🙏' });
  }
}
