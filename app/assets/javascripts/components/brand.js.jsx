var Brand = React.createClass({
  propTypes: {
    resource: React.PropTypes.string,
    notifyParent: React.PropTypes.func
  },

  componentWillReceiveProps: function(nextProps) {
    this.loadBrand(nextProps.resource);
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
    var onSuccess = function(data, text, xhr) {
      switch(xhr.status) {
        case 200:
          this.setState({brand: data});
          break;
        case 404:
          this.notifyParent();
          break;          
      }
    }.bind(this);

    $.ajax(resource, {
      success: onSuccess
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
    this.setState({brand: undefined});
  }
});
