const searchInput = document.querySelector('.search-input')
const searchHints = document.querySelector('.search-hints')

const debounce = (fn, debounceTime) => {
  let timeout

  return function () {
    const callFunc = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(callFunc, debounceTime)
  }
};

function listenerMode(target, element) {
  const selected = document.querySelector('.selected')
  target.addEventListener('click', (e) => {

    searchInput.value = ''
    searchHints.innerHTML = ''

    const selectedRep = document.createElement('li')
    selectedRep.classList.add('selected_rep')

    const wrap = document.createElement('div')

    const name = document.createElement('p')
    name.classList.add('selected_rep-point')
    name.textContent = `Name: ${element.name}`

    const owner = document.createElement('p')
    owner.classList.add('selected_rep-point')
    owner.textContent = `Owner: ${element.full_name.split('/')[0]}`

    const stars = document.createElement('p')
    stars.classList.add('selected_rep-point')
    stars.textContent = `Stars: ${element.stargazers_count}`

    wrap.appendChild(name)
    wrap.appendChild(owner)
    wrap.appendChild(stars)

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('selected_rep-delete')
    const deleteImg = document.createElement('img')
    deleteImg.src = './img/delete.svg'

    deleteBtn.appendChild(deleteImg)

    selectedRep.appendChild(wrap)
    selectedRep.appendChild(deleteBtn)

    selected.prepend(selectedRep)

    deleteBtn.addEventListener('click', (e) => {
      selectedRep.remove()
    })
  })
}

function updateSearchHints(reps) {
  if (reps.length === 0) {
    const undefMess = document.createElement('p')
    undefMess.classList.add('undefined-message')
    undefMess.textContent = 'Ничего не найдено :('

    searchHints.appendChild(undefMess)
  }

  searchHints.innerHTML = ''
  reps.forEach(el => {
    const hint = document.createElement('li')
    hint.classList.add('hint')
    hint.textContent = el.name
    listenerMode(hint, el)
    searchHints.appendChild(hint)
  });
}

const debouncedSearch = debounce((e) => {
  if (e.target.value === '') {
    searchHints.innerHTML = ''
    return
  } else if (e.target.value.trim() == '') {
    searchHints.innerHTML = ''
    return
  }
  fetch(`https://api.github.com/search/repositories?q="${e.target.value}";per_page=5`).then(r => r.json()).then(result => updateSearchHints(result.items))
}, 750)

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e)
})