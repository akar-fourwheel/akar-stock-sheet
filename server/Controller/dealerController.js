import { JWT } from 'google-auth-library';

const SHEET_ID = '15V2kDmWh7HQeghHxW5_u0Tte_-yETeJb';

const serviceAccountAuth = new JWT({
  email: "stock-764@akar-website-454808.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcV+wEa2tD98CR\nxim7TZpBe29KqAWxzE29tPQXQtijLXKKA+qUYHeCdiJgGtma6wq1T3UmHIxIE26t\np9BIU5maAgolKyUvpXUzXFJxaPt65pNFI9xxZmUMmReK4l7NxS5EjtqjkG3cCeXZ\nCwkKjtM915zkUyqJp9LgPS9GptlyOVSay8uMozmSdbGM7shA1jPxCCX7jmHXMgPZ\nS0kNFtnVOSJgDNQhhl9AWjSat24+82qek9x3KRHlX+OxQChmdzMvL+zxQdpuXyVD\nUB5osQrxKl8J3UJICViRdCdBdsbolHNm8/5NMUYgHCdYavsUt3RSmqsZcFWwA7gH\njTiZanrlAgMBAAECggEABYr6c6epTGYWvjRT22+jZent5qwxU33mTbECLGbyzko4\nstrzsKIA6q+shVK+X0cxAH+aLCk78fw6Ys69zCqmmfazjGDMtzU7BACkbZ/mtpNB\nKmTclmqmb31n/8UJzmrMuqKD7uOaeYAiVYEWJ3kr1Rf1WIT4T5wTFl8k83DL6cg/\nXyYgq2zeijyta2+NAEmgLqCEHH9aCMGqBff3vlcfZoVUO1Q9YT4YuQma6jXnqYAF\nUYkHjWTrT1UIVo5nqObjmEiZSg2k0N0hSMcCQypuhrffJOpuYq3QBeX2s3TOUiHv\nV8uFhP/HcwWONc1h78Tv8neqcMbHm5cZKNaqxjM/CwKBgQDLLvyIHLw81E8fXCVW\nXN5THw+V/jLOHyfQiFbHH9xWmhCQyy0ruv+Y4aNOWlOez1RWhHYcwi5A+WHIJ2Hl\nCP74ZQbGOILARwSZSZGNKva0wizlGA1HATI9JLr0Ylv0L9nzsrBX9jLiOwEkEGbI\nor5rcvPFKzQXpaRf4hP5mcyi/wKBgQDE++xe3aLKYSLOxr5Eykhd9IuRzl7g/021\niGA9JCrXOfnvb7EHfJCVqACPHtw/4j3535KxnMx2qGpW3CUVjVY9ajqbRhzvBJkq\nwM4LBjtHkYBGBM9XpjutjasVvPLaVKh8wlOzgP5zc7sv3T48H8sfFcrTl5xUslEo\nqpamvwy2GwKBgQCaPULquJWUv76ImdSmKL2E7/FO9bbvjesVfEoTwvXqr+2fXP0f\nU0cwcSkdE6iix9TIEKnwzt9551X5MRw5V4jmWxq3YrKu77pn+tcJCPJa6YRXLNj3\na8sNa1KYrgoL5j9XpfAD9htObWhCTkkYSaKvwoWWyWM0CEQtnVt4gO49VQKBgBbU\nBzmbP+FqTmleOPCp7KcOzxnvq6kxjSTrkBOl3F0i9+car45pjiv5007Cyc2Rf5M0\nqMBypnNd4yz7yERuI79sTyxtfK7qfoGo5Hf8meQaZZ43snu65RGg6GHViuNoijoj\nHyYfXd2tXNUYM70uBhEtKltJJ7HdFHC9DEZ4v5VfAoGAWS3U/AHN2jkJ/ZhOVJpi\npE/hQbypZCA+xjzG8gTugyxB41OxXuVIjPzjH++lkqRfzmTi/QscvZLONwJzAf3R\n/NOgKbCKC+nJCi1D0Kxa6dHMyA/ZJkkhl+N/WFnm/qh6VqS3JXAIk5YAeivRslXX\nlPxpOSfkoMxL0hZP0vtzFd4=\n-----END PRIVATE KEY-----\n",
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const dealerFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    console.log(carYear,carFuel,carModel);
    
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT L, N,C, COUNT(L) WHERE D = '${carYear}' AND J='${carModel}' AND K='${carFuel}' GROUP BY D, J, K, L, N,C ORDER BY C DESC`)
    }
  
  const token = await serviceAccountAuth.authorize();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}&access_token=${token.access_token}`;
  
  try{
      const resu = await fetch(url);
      const text = await resu.text();
      const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
      const data = JSON.parse(jsonText);
      const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
      
      res.send(rows); 
    }
  catch(e){
    console.log("data not found");
    res.send("data not found");
  }
}

export default dealerFormData;