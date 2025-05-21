module lab_notebook::lab_notebook_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::test_utils::assert_eq;
    use lab_notebook::lab_notebook::{Self, Notebook, Commit};

    const ADMIN: address = @0xA;
    const USER1: address = @0xB;

    #[test]
    fun test_create_notebook() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook
        {
            let ctx = ts::ctx(&mut scenario);
            lab_notebook::create_notebook(ctx, b"ipfs://initial-cid");
        };
        
        // Check if the notebook was created
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            assert_eq(lab_notebook::owner(&notebook), ADMIN);
            assert_eq(lab_notebook::head(&notebook), 0);
            ts::return_to_sender(&scenario, notebook);
            
            let commit = ts::take_from_sender<Commit>(&scenario);
            assert_eq(lab_notebook::commit_id(&commit), 0);
            assert_eq(lab_notebook::commit_author(&commit), ADMIN);
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
            lab_notebook::create_notebook(ctx, b"ipfs://initial-cid");
        };
        
        // Add a new commit
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            lab_notebook::add_commit(&mut notebook, b"ipfs://updated-cid", ctx);
            assert_eq(lab_notebook::head(&notebook), 1);
            
            ts::return_to_sender(&scenario, notebook);
        };
        
        // Check the new commit
        ts::next_tx(&mut scenario, ADMIN);
        {
            let commit = ts::take_from_sender<Commit>(&scenario);
            assert_eq(lab_notebook::commit_id(&commit), 1);
            assert_eq(lab_notebook::commit_author(&commit), ADMIN);
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
            lab_notebook::create_notebook(ctx, b"ipfs://initial-cid");
        };
        
        // Fork the notebook as USER1
        ts::next_tx(&mut scenario, USER1);
        {
            let original_notebook = ts::take_from_address<Notebook>(&scenario, ADMIN);
            let ctx = ts::ctx(&mut scenario);
            
            lab_notebook::fork_notebook(&original_notebook, ctx);
            
            ts::return_to_address(ADMIN, original_notebook);
        };
        
        // Check the forked notebook
        ts::next_tx(&mut scenario, USER1);
        {
            let forked_notebook = ts::take_from_sender<Notebook>(&scenario);
            assert_eq(lab_notebook::owner(&forked_notebook), USER1);
            assert_eq(lab_notebook::head(&forked_notebook), 0);
            ts::return_to_sender(&scenario, forked_notebook);
        };
        
        ts::end(scenario);
    }

    #[test]
    fun test_set_head() {
        let scenario = ts::begin(ADMIN);
        
        // Create a new notebook and add commits
        {
            let ctx = ts::ctx(&mut scenario);
            lab_notebook::create_notebook(ctx, b"ipfs://initial-cid");
        };
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let notebook = ts::take_from_sender<Notebook>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            lab_notebook::add_commit(&mut notebook, b"ipfs://commit-1", ctx);
            lab_notebook::add_commit(&mut notebook, b"ipfs://commit-2", ctx);
            
            assert_eq(lab_notebook::head(&notebook), 2);
            
            // Set head back to commit 1
            let ctx = ts::ctx(&mut scenario);
            lab_notebook::set_head(&mut notebook, 1, ctx);
            assert_eq(lab_notebook::head(&notebook), 1);
            
            ts::return_to_sender(&scenario, notebook);
        };
        
        ts::end(scenario);
    }
}