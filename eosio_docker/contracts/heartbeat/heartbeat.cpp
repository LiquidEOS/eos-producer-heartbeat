#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

// Smart Contract Name: heartbeat_contract
// Table struct:
//   notestruct: multi index table to store the heartbeat data
//     user(account_name/uint64): account name for the bp
//     metadata_json(string): the metadata
//     timestamp(uint64): the last update block time
// Public method:
//   isnewuser => to check if the given account name has entry in table or not
// Public actions:
//   heartbeat => put the metadata into the multi-index table and sign by the given account

class heartbeat_contract : public eosio::contract {
  private:
    bool isnewuser( account_name user ) {
      hbtable hbobj(_self, _self);
      // get object by secordary key
      auto hb = hbobj.find(user);

      return hb == hbobj.end();
    }

    /// @abi table
    struct hbstruct {
      account_name  user;      // account name for the user
      std::string   metadata_json;      // the note message
      uint64_t      timestamp; // the store the last update block time
      // primary key
      account_name primary_key() const { return user; }
    };

    typedef eosio::multi_index< N(hbstruct), hbstruct> hbtable;

  public:
    using contract::contract;

    /// @abi action
    void heartbeat( account_name _user, std::string& _metadata_json ) {
      // to sign the action with the given account
      require_auth( _user );

      hbtable obj(_self, _self); // code, scope

      // create new / update hb depends whether the user account exist or not
      if (isnewuser(_user)) {
        // insert object
        obj.emplace( _user, [&]( auto& address ) {
          address.user                 = _user;
          address.metadata_json        = _metadata_json;
          address.timestamp            = now();
        });
      } else {
        auto &hb = obj.get(_user);
        // update object
        obj.modify( hb, _user, [&]( auto& address ) {
          address.metadata_json        = _metadata_json;
          address.timestamp   = now();
        });
      }
    }

};

EOSIO_ABI( heartbeat_contract, (heartbeat) )
