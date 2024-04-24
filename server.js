import axios from "axios";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("prompt", "Lighthouse on a cliff overlooking the ocean");
    formData.append("output_format", "webp");

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      formData,
      {
        headers: { 
          Authorization: `Bearer ${process.env.STABILITYAI}`, 
          Accept: "application/json" 
        },
        responseType: "arraybuffer"
      },
    );
    
    if(response.status === 200) {
      res.send(response.data);
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));
