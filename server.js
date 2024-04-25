import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
	console.log("--POST")
  try {
    const formData = {
      prompt: "Lighthouse on a cliff overlooking the ocean",
      output_format: "webp"
    };
    
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer `+ process.env.STABILITYAI, 
          Accept: "application/json" 
        },
      },
    );
    
    if(response.status === 200) {

		// console.log(response)q
    //   const data = response.json()
	console.log("---DATA")
	console.log(response.data)
      res.send(response.data)
      //fs.writeFileSync("./lighthouse.webp", Buffer.from(response.data));
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }

  } catch (error) {
    console.error(error)
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));