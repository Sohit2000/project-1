const imagesWrapper = document.querySelector(".images");

const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");






const apiKey = "GtajLns6ViLU4zWUKgjxEN1B3XcvSRtnRndENIJVvyRzSpuWwR5ND6zN";
const perPage = 16; 
let currentPage = 1;
let searchTerm = null;


const downlodeImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() =>alert("failed to downlode image!"))
}

const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = 'hidden';
}

const hideLightbox = () =>{
    lightBox.classList.remove("show");
    document.body.style.overflow = 'auto';
}



const generateHTML = (images) => {
 imagesWrapper.innerHTML += images.map(img =>
      
        `
  <li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photografhar">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downlodeImg('${img.src.large2x}');event.stopPropagation();  ">
                <i class="uil uil-import"></i>
                </button>
            </div>
        </li>

      `

        ).join("");

}



const getImages = (apiURL) => {
     loadMoreBtn.innerText = "Loading...";
     loadMoreBtn.classList.add("disabled");


    fetch(apiURL, {
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
} 

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);

}

loadSearchImages = (e) => {
if(e.target.value === "") return searchTerm = null;

    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

searchInput.addEventListener("keyup", loadSearchImages);
loadMoreBtn.addEventListener("click", loadMoreImages);

closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downlodeImg(e.target.dataset.img));






