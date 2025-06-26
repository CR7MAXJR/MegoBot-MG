import axios from 'axios';

let handler = async (m, { conn }) => {
    let query = m.text; // Adjust based on how the query is passed
    if (!query) return m.reply('Please provide a query.');

    const searchUrl = 'https://www.muslimai.io/api/search';
    const searchData = { query };

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const searchResponse = await axios.post(searchUrl, searchData, { headers });
        const passages = searchResponse.data.map(item => item.content).join('\n\n');

        const answerUrl = 'https://www.muslimai.io/api/answer';
        const answerData = {
            prompt: استخدم الفقرات التالية للإجابة على الاستفسار بأفضل ما يمكنك كخبير عالمي في القرآن. لا تذكر أنك حصلت على أي فقرات في إجابتك: ${query}\n\n${passages}
        };

        const answerResponse = await axios.post(answerUrl, answerData, { headers });
        const result = {
            answer: answerResponse.data,
            source: searchResponse.data
        };

        m.reply(result.answer);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        m.reply('An error occurred.');
    }
};

handler.help = handler.command = ['muslimai'];
handler.tags = ['main'];
export default handler;
