var Button = app.ReactBootstrap.Button;

var Brand = React.createClass({
  propTypes: {
    resource: React.PropTypes.string
  },

  componentWillMount: function() {
    this.loadBrand(this.props.resource);
  },

  getInitialState: function() {
    return {
      brand: undefined
    };
  },

  loadBrand: function(resource) {
    $.ajax(resource, {
      success: function(data) {
        this.setState({brand: data});
      }.bind(this),
      error: function(err) {
        this.setState({brand: undefined });
      }.bind(this)
    });
  },

  render: function() {
    if (this.state.brand === undefined) {
      return(<div></div>);
    }
    else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{this.state.brand.name}</h3>
          </div>
          <div className="panel-body">
            <table className="table table-condensed table-responsive table-bordered table-striped">
              <thead>
                <tr>
                  <th>API Resource</th>
                  <th>Locations</th>
                  <th>Menu Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.brand.links[0].href}</td>
                  <td>{this.state.brand.locations.length}</td>
                  <td>{this.state.brand.menu_items.length}</td>
                  <td>
                    <BrandModal
                      brand={this.state.brand}
                      notifyParent={this.setResourceDirty}
                    />        
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="row">
            <div className="col-xs-2">
                <Button
                  bsStyle="primary"
                  bsSize="sm"
                  href={
                    function() {
                      brand_id = this.state.brand.links[0].href.split('/').pop();
                      return app.getUrl(location, 'brand/', 'web') + brand_id + '/locations'
                    }.bind(this)()
                  }
                >
                  Manage Locations
                </Button>
              </div> 
              <div className="col-xs-2">
                <Button
                  bsStyle="primary"
                  bsSize="sm"
                  href={
                    function() {
                      brand_id = this.state.brand.links[0].href.split('/').pop();
                      return app.getUrl(location, 'brand/', 'web') + brand_id + '/menu_items'
                    }.bind(this)()
                  }
                >
                  Manage Menu Items
                </Button> 
              </div>
            </div>
          </div>
        </div>
      );
    }
  },

  setResourceDirty: function() {
    this.loadBrand(this.props.resource);
  }
});
