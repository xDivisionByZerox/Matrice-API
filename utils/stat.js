function softmax(arr) {
    return arr.map(function(value,index) { 
      return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}

// Get posts - return primary tags to work on
module.exports.primaryTags = async (posts) =>{
  // Count number of tags
  var tagCounts = posts.reduce((acc, document) => {
    document.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // Sofmax give us the forces of the tags
  var values = Object.values(tagCounts);
  var probValue = softmax(values);
  var index = 0;
  // Create dictionary { tag -> force }
  tagStats = {}
  for( tag in tagCounts){
    tagStats[tag] = probValue[index];
    index++;
  }
  const categoriesArray = Object.entries(tagStats);
  // Sort DESC
  categoriesArray.sort((a, b) => b[1] - a[1]);
  // 5 master tags
  const top5Categories = categoriesArray.slice(0, 5);
  const total = top5Categories.reduce((acc, category) => acc + category[1], 0);
  // Force -> %
  const proportions = top5Categories.map(category => [category[0], Math.round((category[1] / total) * 100 / 10) * 10]);
  return proportions;
}

module.exports.getAllKeys = async (documents) => {
  let allKeys = new Set();
  documents.forEach(doc => {
    Object.keys(doc).forEach(key => {
      allKeys.add(key);
    });
  });
  return Array.from(allKeys);
}