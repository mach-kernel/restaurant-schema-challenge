var Button = app.ReactBootstrap.Button;
var BrandCollection = React.createClass({
  componentWillMount: function() {
    this.loadBrands();
    // app.clippyAgent.show();
    // app.clippyAgent.speak(
    //   'It looks like you\'re trying to modify a Brand resource!'
    // );
  },

  getInitialState: function() {
    return {
      brands: undefined
    };
  },

  onBrandCreate: function(new_brand) {
    new_collection = this.state.brands;
    new_collection.push(new_brand);

    this.setState({
      brands: new_collection
    })
  },

  loadBrands: function() {
    var onSuccess = function(data) {
      this.setState({
        brands: $.grep(data.links, function(link) {
          return link.rel == 'resources';
        })[0].href,
      });
    }.bind(this);

    $.ajax(app.getUrl(location, 'brand'), {
      success: onSuccess
    });
  },

  render: function() {
    if (this.state.brands === undefined) {
      return(<div></div>);      
    }
    else {
      return(
        <div>
          <div className="row">
            <Col smOffset={11} sm={1}>
              <BrandModal
                brand={undefined}
                notifyParent={this.onBrandCreate}
                create={true}
              />
            </Col>
          </div>
            <br />
          {
            this.state.brands.map(function(brand) {
              if (typeof brand === 'string') {
                return <Brand 
                          key={brand}
                          resource={brand}
                          create={false}
                       />                
              } else { return brand; }
            })
          }
        </div>
      );    
    }
  }
});
