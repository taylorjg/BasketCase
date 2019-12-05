const axios = require('axios')
const fs = require('fs').promises
const path = require('path')

const downloadImages = async (products, folder, productToUrl) => {
  const urls = products.map(productToUrl)
  const axiosPromises = []
  for (const url of urls) {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log(`Fetching ${url}`)
    axiosPromises.push(axios.get(url, { responseType: 'arraybuffer' }))
  }
  const axiosResponses = await Promise.all(axiosPromises)
  const fsPromises = axiosResponses.map((axiosResponse, index) => {
    const basename = path.basename(urls[index])
    const imageFileName = path.resolve(__dirname, '..', 'src', 'assets', folder, basename)
    console.log(`Saving ${imageFileName}`)
    return fs.writeFile(imageFileName, axiosResponse.data)
  })
  await Promise.all(fsPromises)
}

const main = async () => {
  const jsonFileName = path.resolve(__dirname, '..', 'json2bulk', 'bulk.json')
  const buffer = await fs.readFile(jsonFileName, 'utf8')
  const lines = buffer.split('\n').filter(line => line.length)
  const numPairs = lines.length / 2
  const indices = Array.from(Array(numPairs).keys())
  const products = indices.map(index => JSON.parse(lines[index * 2 + 1]))
  await downloadImages(products, 'product-images', product => `http:${product.Image}`)
  await downloadImages(products, 'brand-images', product => {
    const brand = product.Brand.toLowerCase();
    return `http://media.ao.com/brandlogos/en-GB/${brand}.png`;
  })
}

main()
