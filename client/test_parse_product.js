const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const url = 'https://nazaradiamonds.com/product/circle-layered-necklace/';
    const html = await fetchUrl(url);
    
    // 1. Get Title and Price from entry summary
    const summaryStart = html.indexOf('class="summary entry-summary"');
    let summarySub = '';
    if (summaryStart !== -1) {
      summarySub = html.substring(summaryStart, summaryStart + 15000);
    }
    
    const titleMatch = html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)<\/h1>/);
    console.log('Title:', titleMatch ? titleMatch[1].trim() : 'Not Found');
    
    const priceRegex = /<p class="price">[\s\S]*?<span class="woocommerce-Price-amount amount">[^<]*<bdi>[^<]*<span class="woocommerce-Price-currencySymbol">[^<]*<\/span>([\d,]+)/;
    const priceMatch = summarySub.match(priceRegex);
    console.log('Price:', priceMatch ? priceMatch[1] : 'Not Found');
    
    // 2. Get Categories
    // Usually: <span class="posted_in">Category: <a href="..." rel="tag">Necklace</a></span>
    const catMatch = html.match(/<span class="posted_in">[\s\S]*?<a[^>]*>([^<]+)<\/a>/) || html.match(/posted_in[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    console.log('Category:', catMatch ? catMatch[1].trim() : 'Not Found');
    
    // 3. Get Description
    // Look for <div class="woocommerce-product-details__short-description"> or tab description
    const descMatch = html.match(/<div class="woocommerce-product-details__short-description">([\s\S]*?)<\/div>/) ||
                      html.match(/id="tab-description"[\s\S]*?<p>([\s\S]*?)<\/p>/) ||
                      html.match(/<div[^>]*class="description"[^>]*>([\s\S]*?)<\/div>/);
    console.log('Description:', descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'Not Found');
    
    // 4. Get Images
    const imgUrls = [];
    const imgRegex = /data-large_image="([^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      if (!imgUrls.includes(imgMatch[1])) {
        imgUrls.push(imgMatch[1]);
      }
    }
    console.log('Images:', imgUrls);
    
    // 5. Get Attributes (Specifications)
    // WooCommerce attributes table
    const attrTableStart = html.indexOf('<table class="woocommerce-product-attributes shop_attributes">');
    if (attrTableStart !== -1) {
      console.log('Found attributes table!');
      const attrTableSub = html.substring(attrTableStart, html.indexOf('</table>', attrTableStart) + 8);
      // Let's parse each tr
      const trRegex = /<tr[^>]*>[\s\S]*?<th[^>]*>([^<]+)<\/th>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g;
      let trMatch;
      const specs = {};
      while ((trMatch = trRegex.exec(attrTableSub)) !== null) {
        const name = trMatch[1].trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
        const val = trMatch[2].trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
        specs[name] = val;
      }
      console.log('Specifications:', specs);
    } else {
      console.log('Attributes table not found.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
