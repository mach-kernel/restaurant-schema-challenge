var Button = app.ReactBootstrap.Button;
var LocationCollection = React.createClass({
  componentWillMount: function() {
    path = location.pathname.split('/');
    path.pop();
    this.loadResources(path.pop());
  },

  getInitialState: function() {
    return {
      brand: undefined,
      locations: undefined
    };
  },

  onLocationCreate: function(new_location) {
    new_collection = this.state.locations;
    new_collection.push(new_location);

    this.setState({
      locations: new_collection
    })
  },

  loadResources: function(id) {
    var onSuccess = function(data) {
      this.setState({
        brand: data,
        locations: data.locations
      });
    }.bind(this);

    $.ajax(app.getUrl(location, 'brand') + '/' + id, {
      success: onSuccess
    });
  },

  render: function() {
    if (this.state.brand === undefined) {
      return(<div></div>);      
    }
    else {
      return(
        <div>
          <div className="row">
            <h1 className="title">{this.state.brand.name}</h1>
            <h3>Manage Locations</h3>
          </div>
          <br />
          <div className="row">
            <div className="container">
              <div className="row">
                <Col smOffset={11} sm={1}>
                  <LocationModal
                    brand={undefined}
                    notifyParent={this.onLocationCreate}
                    create={this.state.brand.links[0].href.split('/').pop()}
                  />
                </Col>
              </div>
            <br />
            {
              this.state.locations.map(function(location) {
                if (typeof location === 'object') {
                  return <Location 
                            key={location.links[0].href}
                            resource={location}
                         />                
                }
              })
            }
            </div>
          </div>
        </div>
      );    
    }
  }
});
