export default class Node {
  public next?: Node;
  public active: boolean = false;


  constructor(copyFromNode?: Node, public isActivator: boolean = false) {
    if (copyFromNode) {
      this.active = copyFromNode.active
      this.next = copyFromNode.next
    }
  }

  public hasNext(): boolean {
    return !!this.next;
  }

  public get branch(): Node[] {
    return this.map(n => n)
  }

  public get length(): number {
    return this.branch.length;
  }

  public get leaf(): Node {
    return this.branch[this.branch.length - 1]
  }

  public addChild(node: Node) {
    this.leaf.next = node;
  }

  public forEach(cb: (node: Node) => any) {
    let currentNode: Node = this;
    cb(currentNode);
    while (currentNode.hasNext() && currentNode !== this) {
      currentNode = currentNode.next as Node;
      cb(currentNode);
    }
  }

  public map(cb: (node: Node) => any): any[] {
    const mappedNodes: Node[] = [];
    this.forEach((n: Node) => {
      mappedNodes.push(cb(n));
    });
    return mappedNodes;
  }

  public dup(): Node {
    const newRoot = new Node(this)
    let currentNode = newRoot;

    if (this.next) {
      this.next.forEach(n => {
        const newNode = new Node(n)
        currentNode.next = newNode;
        currentNode = newNode;
      })
    }
    return newRoot;
  }

}