var BrandCollection = React.createClass({

  getInitialState: function() {
    return {
      brands: undefined
    };
  },

  loadBrands: function() {
    var onSuccess = function(data) {
      this.setState({
        brands: $.grep(data.links, function(link) {
          return link.rel == 'resources';
        })[0].href
      });
    }.bind(this);

    $.ajax('http://localhost:3000/v1/brand', {
      success: onSuccess
    });
  },

  componentWillMount: function() {
    this.loadBrands();
  },

  render: function() {
    if (this.state.brands === undefined) {
      return(<div></div>);      
    }
    else {
      var listBrands = this.state.brands.map(function(brand) {
        return <Brand key={brand} resource={brand} />
      });

      return(<div>{listBrands}</div>);    
    }
  }
});
