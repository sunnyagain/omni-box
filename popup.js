document.addEventListener('DOMContentLoaded', function() {
  const keywordInput = document.getElementById('keyword');
  const urlInput = document.getElementById('url');
  const addPatternButton = document.getElementById('addPattern');
  const patternsDiv = document.getElementById('patterns');

  function loadPatterns() {
    chrome.storage.sync.get('patterns', (data) => {
      const patterns = data.patterns || [];
      patternsDiv.innerHTML = '';
      patterns.forEach((pattern, index) => {
        const div = document.createElement('div');
        div.classList.add('pattern');
        
        const keywordInput = document.createElement('input');
        keywordInput.value = pattern.keyword;
        const urlInput = document.createElement('input');
        urlInput.value = pattern.url;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => {
          patterns[index].keyword = keywordInput.value.trim();
          patterns[index].url = urlInput.value.trim();
          chrome.storage.sync.set({ patterns }, loadPatterns);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
          patterns.splice(index, 1);
          chrome.storage.sync.set({ patterns }, loadPatterns);
        };

        div.appendChild(keywordInput);
        div.appendChild(urlInput);
        div.appendChild(saveButton);
        div.appendChild(deleteButton);
        patternsDiv.appendChild(div);
      });
    });
  }

  addPatternButton.onclick = () => {
    const keyword = keywordInput.value.trim();
    const url = urlInput.value.trim();
    if (keyword && url) {
      chrome.storage.sync.get('patterns', (data) => {
        const patterns = data.patterns || [];
        patterns.push({ keyword, url });
        chrome.storage.sync.set({ patterns }, loadPatterns);
      });
      keywordInput.value = '';
      urlInput.value = '';
    }
  };

  loadPatterns();
});
