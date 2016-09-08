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
                  <th>API Resource Location</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.brand.links[0].href}</td>
                  <td>
                    <BrandModal
                      brand={this.state.brand}
                      notifyParent={this.setResourceDirty}
                    />               
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  },

  setResourceDirty: function() {
    this.loadBrand(this.props.resource);
  }
});
