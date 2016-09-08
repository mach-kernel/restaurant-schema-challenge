var BrandCollection = React.createClass({
  componentWillMount: function() {
    this.loadBrands();
  },

  componentWillUpdate: function() {
    this.loadBrands();
  },

  getInitialState: function() {
    return {
      brands: undefined,
      brandComponents: undefined
    };
  },

  loadBrands: function() {
    var onSuccess = function(data) {
      this.setState({
        brands: $.grep(data.links, function(link) {
          return link.rel == 'resources';
        })[0].href,
        brandComponents: this.state.brands.map(function(brand) {
          return <Brand 
                    key={brand}
                    resource={brand}
                    notifyParent={this.setResourceDirty}
                 />
          });
      });
    }.bind(this);

    $.ajax('http://localhost:3000/v1/brand', {
      success: onSuccess
    });
  },

  render: function() {
    if (this.state.brands === undefined) {
      return(<div></div>);      
    }
    else {
      return(<div>{this.state.brandComponents}</div>);    
    }
  },

  setResourceDirty: function() {
    this.setState({brands: undefined});
  }
});
