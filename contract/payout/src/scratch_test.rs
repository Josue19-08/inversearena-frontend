use soroban_sdk::{Env, xdr::ToXdr, IntoVal};
use crate::DataKey; // from payout
#[test]
fn test_to_xdr() {
    let env = Env::default();
    let val = DataKey::Admin;
    let xdr = env.to_xdr(&val);
    println!("XDR: {:?}", xdr);
}
