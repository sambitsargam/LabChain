module lab_notebook::lab_notebook {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::option::{Self, Option};

    /// A Lab Notebook object that stores research data
    struct Notebook has key {
        id: UID,
        owner: address,
        head: u64,
    }

    /// A Commit object representing a version of the notebook
    struct Commit has key {
        id: UID,
        commit_id: u64,
        parent: Option<u64>,
        cid: String,
        author: address,
    }

    // Error codes
    const ENotOwner: u64 = 0;
    const EInvalidCommitId: u64 = 1;

    /// Creates a new lab notebook with initial content
    public entry fun create_notebook(ctx: &mut TxContext, cid: vector<u8>) {
        let notebook = Notebook {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            head: 0,
        };

        let commit = Commit {
            id: object::new(ctx),
            commit_id: 0,
            parent: option::none(),
            cid: string::utf8(cid),
            author: tx_context::sender(ctx),
        };

        transfer::transfer(notebook, tx_context::sender(ctx));
        transfer::transfer(commit, tx_context::sender(ctx));
    }

    /// Adds a new commit to an existing notebook
    public entry fun add_commit(
        notebook: &mut Notebook,
        cid: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == notebook.owner, ENotOwner);

        let new_commit_id = notebook.head + 1;
        let commit = Commit {
            id: object::new(ctx),
            commit_id: new_commit_id,
            parent: option::some(notebook.head),
            cid: string::utf8(cid),
            author: sender,
        };

        notebook.head = new_commit_id;
        transfer::transfer(commit, sender);
    }

    /// Creates a fork of an existing notebook
    public entry fun fork_notebook(original: &Notebook, ctx: &mut TxContext) {
        let forked_notebook = Notebook {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            head: original.head,
        };

        transfer::transfer(forked_notebook, tx_context::sender(ctx));
    }

    /// Sets the head of the notebook to a specific commit
    public entry fun set_head(
        notebook: &mut Notebook,
        commit_id: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == notebook.owner, ENotOwner);
        assert!(commit_id <= notebook.head, EInvalidCommitId);
        notebook.head = commit_id;
    }

    // === Getter Functions ===

    public fun owner(notebook: &Notebook): address {
        notebook.owner
    }

    public fun head(notebook: &Notebook): u64 {
        notebook.head
    }

    public fun commit_id(commit: &Commit): u64 {
        commit.commit_id
    }

    public fun commit_cid(commit: &Commit): &String {
        &commit.cid
    }

    public fun commit_author(commit: &Commit): address {
        commit.author
    }
}