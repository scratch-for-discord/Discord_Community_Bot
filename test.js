const title = "Found a bug";
const labels = ["Fix"]; 

const response = await fetch(`https://api.github.com/repos/scratch-for-discord/Web-Application_Frontend/issues`, {
  method: "POST",
  headers: {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${process.env.GITHUB}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ title, body, labels }),
})
if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
const json = await response.json();