var BrandCollection = React.createClass({

  getInitialState: function() {
    return {
      brands: []  
    };
  },

  loadBrands: function() {
    var that = this;

    $.ajax('http://localhost:3000/v1/brand', {
      success: function(data) {
        that.setState({
          brands: $.grep(data.links, function(link) {
            return link.rel == 'resources';
          })[0].href
        });
      }
    });
  },

  componentWillMount: function() {
    this.loadBrands();
  },

  render: function() {
    var listBrands = this.state.brands.map(function(brand) {
      return <Brand key={brand} resource={brand} />
    });

    return(<div>{listBrands}</div>);
  }
});
