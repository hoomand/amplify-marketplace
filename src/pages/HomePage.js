import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { searchMarkets } from "../graphql/queries";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";

class HomePage extends React.Component {
  state = {
    searchTerm: "",
    searchResults: [],
    isSearching: false,
  };

  handleSearchChange = (searchTerm) => this.setState({ searchTerm });
  handleClearSearch = () =>
    this.setState({ searchTerm: "", searchResults: [] });

  handleSearch = async (event) => {
    const { searchTerm } = this.state;
    try {
      event.preventDefault();
      this.setState({ isSearching: true });
      const result = await API.graphql(
        graphqlOperation(searchMarkets, {
          filter: {
            or: [
              { name: { match: searchTerm } },
              { owner: { match: searchTerm } },
              { tags: { match: searchTerm } },
            ],
          },
          sort: {
            field: "createdAt",
            direction: "desc",
          },
        })
      );
      this.setState({
        searchResults: result.data.searchMarkets.items,
        isSearching: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <>
        <NewMarket
          searchTerm={this.state.searchTerm}
          isSearching={this.state.isSearching}
          handleSearchChange={this.handleSearchChange}
          handleClearSearch={this.handleClearSearch}
          handleSearch={this.handleSearch}
        />
        <MarketList searchResults={this.state.searchResults} />
      </>
    );
  }
}

export default HomePage;
