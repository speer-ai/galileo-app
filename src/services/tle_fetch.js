
var url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle'
async function fetch_all_data() {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data`);
      }
      return response.text();
    })
    .catch(error => {
      console.error(error);
    });
}


function process_raw(raw) {
  const tle_data = [];

  if (!raw) return { retrieval_date: new Date().toISOString(), num_entries: 0, entries: [] };

  // remove empty lines that may occur at the end of the file
  const lines = raw.split('\n').filter((l) => l.trim().length);

  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i + 1] && lines[i + 2]) {
      tle_data.push({
        id: i / 3 + 1,
        name: lines[i].trim(),
        line1: lines[i + 1].trim(),
        line2: lines[i + 2].trim(),
      });
    }
  }

  //give a packet to return
  return {
    retrieval_date: new Date().toISOString(),
    num_entries: tle_data.length,
    entries: tle_data
  }
}

//adds to local storage or retrieves from local storage
async function load_data() {
  //if data is there and the time is less than an hour, return the data
  if (localStorage.getItem('tle_data') && Date.now() - new Date(JSON.parse(localStorage.getItem('tle_data')).retrieval_date).getTime() < 3600 * 1000) {
    return JSON.parse(localStorage.getItem('tle_data'));
  }
  //otherwise, fetch new data
  const raw = await fetch_all_data();
  console.log('rawOut', raw);
  const data = process_raw(raw);
  console.log('data', data)

  //store the data
  localStorage.setItem('tle_data', JSON.stringify(data));

  return data;
}

export default load_data;