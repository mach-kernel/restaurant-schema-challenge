var Button = app.ReactBootstrap.Button;

var MenuItemPricing = React.createClass({
  propTypes: {
    menu_items: React.PropTypes.array,
    order_types: React.PropTypes.array,
    day_parts: React.PropTypes.array
  },

  getInitialState: function() {
    return {
      menu_items: undefined,
      order_types: undefined,
      day_parts: undefined
    };
  },

  updateAmountField: function() {

  },

  render: function() {
    if (this.state.location === undefined) {
      return(<div></div>);
    }
    else {
      return (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Price</th>
              <th>Order Type</th>
              <th>Day Part (optional)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>   
                <FormControl
                  id="amount_field"
                  type="text"
                  placeholder="e.g. 99.99"
                  className="input-sm"
                  onChange={this.updateAmountField}
                />      
              </td>
              <td>
                <Button
                  bsStyle="success"
                  bsSize="sm"
                  onClick={this.create}
                >Save</Button>
              </td>
            </tr>
          </tbody>
        </Table>      );
    }
  }
});
