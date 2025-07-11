'use strict';

import lunr from 'lunr';

const SearchApp = {
    searchField: document.querySelector("#searchField"),
    searchButton: document.querySelector("#searchButton"),
    allwords: document.querySelector('#allwords'),
    output: document.querySelector("#output"),
    searchData: {},
    searchIndex: {}
};

fetch('/search/index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        SearchApp.searchData = data;
        SearchApp.searchIndex = lunr(function () {
            this.pipeline.remove(lunr.stemmer);
            this.searchPipeline.remove(lunr.stemmer);
            this.ref('href');
            this.field('title');
            this.field('body');
            this.field('keywords');
            data.results.forEach(e => {
                this.add(e);
            });
        });
    })
    .catch(error => {
        console.error('Error loading search index:', error);
    });


const search = () => {
    let searchText = SearchApp.searchField.value;

    if (searchText === '') return;

    searchText = searchText
        .split(' ')
        .map(word => `${word}*`)
        .join(' ');

    if (SearchApp.allwords.checked) {
        searchText = searchText
            .split(' ')
            .map(word => `+${word}`)
            .join(' ');
    }

    let resultList = SearchApp.searchIndex.search(searchText);

    let list = [];
    let results = resultList.map(entry => {
        SearchApp.searchData.results.filter(d => {
            if (entry.ref == d.href) {
                list.push(d);
            }
        });
    });
    display(list);
};

const display = (list) => {
    SearchApp.output.innerText = '';
    if (list.length > 0) {
        const ul = document.createElement('ul');
        list.forEach(el => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = el.href;
            a.text = el.title;
            li.appendChild(a);
            ul.appendChild(li);
        });
        SearchApp.output.appendChild(ul);
    } else {
        SearchApp.output.innerHTML = "Nothing found";
    }
};


SearchApp.searchButton.addEventListener('click', search);