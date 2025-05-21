#[test_only]
module LabNotebook_Tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::test_utils::{assert_eq};
    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use LabNotebook::{Self, Notebook, Commit};

    const ADMIN: address = @0xA;
    const USER1: address = @0xB;

    #[test]
    fun test_create_notebook() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook
        {
            let ctx = ts::ctx(&mut scenario);
            LabNotebook::create_notebook(ctx, "ipfs://initial-cid");
        };
        
        // Check if the notebook was created
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            assert_eq(LabNotebook::owner(&notebook), ADMIN);
            assert_eq(LabNotebook::head(&notebook), 0);
            ts::return_to_sender(&scenario, notebook);
            
            let commit = ts::take_from_sender<Commit>(&scenario);
            assert_eq(LabNotebook::commit_id(&commit), 0);
            assert_eq(LabNotebook::commit_cid(&commit), "ipfs://initial-cid");
            assert_eq(LabNotebook::commit_author(&commit), ADMIN);
            ts::return_to_sender(&scenario, commit);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_add_commit() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook
        {
            let ctx = ts::ctx(&mut scenario);
            LabNotebook::create_notebook(ctx, "ipfs://initial-cid");
        };
        
        // Add a new commit to the notebook
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            let new_id = LabNotebook::add_commit(ctx, &mut notebook, "ipfs://updated-cid");
            assert_eq(new_id, 1);
            assert_eq(LabNotebook::head(&notebook), 1);
            
            ts::return_to_sender(&scenario, notebook);
        };
        
        // Check if the new commit was created
        ts::next_tx(&mut scenario, ADMIN);
        {
            let commit = ts::take_from_sender<Commit>(&scenario);
            assert_eq(LabNotebook::commit_id(&commit), 1);
            assert_eq(LabNotebook::commit_cid(&commit), "ipfs://updated-cid");
            assert_eq(LabNotebook::commit_author(&commit), ADMIN);
            ts::return_to_sender(&scenario, commit);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_fork_notebook() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook
        {
            let ctx = ts::ctx(&mut scenario);
            LabNotebook::create_notebook(ctx, "ipfs://initial-cid");
        };
        
        // Fork the notebook as USER1
        ts::next_tx(&mut scenario, USER1);
        {
            let original_notebook = ts::take_from_address<Notebook>(&scenario, ADMIN);
            let ctx = ts::ctx(&mut scenario);
            
            LabNotebook::fork_notebook(ctx, &original_notebook);
            
            ts::return_to_address(ADMIN, original_notebook);
        };
        
        // Check if the fork was created
        ts::next_tx(&mut scenario, USER1);
        {
            let forked_notebook = ts::take_from_sender<Notebook>(&scenario);
            assert_eq(LabNotebook::owner(&forked_notebook), USER1);
            assert_eq(LabNotebook::head(&forked_notebook), 0); // Same head as original
            ts::return_to_sender(&scenario, forked_notebook);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_set_head() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook
        {
            let ctx = ts::ctx(&mut scenario);
            LabNotebook::create_notebook(ctx, "ipfs://initial-cid");
        };
        
        // Add commits
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            LabNotebook::add_commit(ctx, &mut notebook, "ipfs://commit-1");
            ts::return_to_sender(&scenario, notebook);
        };
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            LabNotebook::add_commit(ctx, &mut notebook, "ipfs://commit-2");
            ts::return_to_sender(&scenario, notebook);
        };
        
        // Set head back to commit 1
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            LabNotebook::set_head(ctx, &mut notebook, 1);
            assert_eq(LabNotebook::head(&notebook), 1);
            
            ts::return_to_sender(&scenario, notebook);
        };
        
        ts::end(scenario);
    }
}