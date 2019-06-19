{
    // inefficient priority queue (can be improved using min binary heap)
    class PriorityQueue {
        queue = [];

        enQueue(val, priority){
            this.queue.push({val, priority});
            this.queue.sort((a,b)=> b.priority - a.priority);
        }

        deQueue(){
            return this.queue.pop();
        }
    }

    class Node {
        constructor(vertex, weight){
            this.vertex = vertex;
            this.weight = weight;
        }
    }
    // undirected weighted sparse graph
    class WeightedGraph {
        adjacencyList = new Map();

        addVertex(val){
            this.adjacencyList.set(val,[]);
            return this.adjacencyList;
        }

        removeVertex(vertex){
            if(!this.adjacencyList.has(vertex)) return null;
            // remove from neighbours as well
            for(let v of this.adjacencyList.get(vertex)){
                this.removeEdge(v, vertex);
            }

            this.adjacencyList.delete(vertex);
            return this.adjacencyList;
        }

        addEdge(v1, v2, weight){
            if(!this.adjacencyList.has(v1) || !this.adjacencyList.has(v2)) return null;

            this.adjacencyList.get(v1).push(new Node(v2, weight))
            this.adjacencyList.get(v2).push(new Node(v1, weight))

            return this.adjacencyList;
        }

        removeEdge(v1, v2){
            if(!this.adjacencyList.has(v1) || !this.adjacencyList.has(v2)) return null;

           let vertex1 = this.adjacencyList.get(v1).filter(v => v.vertex !== v2.vertex);

           let vertex2 = this.adjacencyList.get(v2).filter(v => v.vertex !== v1.vertex)
            // remove from neighbour as well
            this.adjacencyList.set(v1, vertex1);
            this.adjacencyList.set(v2, vertex2);

            return this.adjacencyList;
        }

        DFSRecursive(vertex){
            let set = new Set(), res = [];
            const helper = (node) => {
                if(!node) return;
                res.push(node);
                set.add(node);
                // all the neighbours
                for(let v of this.adjacencyList.get(node)){
                    if(!set.has(v.vertex)) helper(v.vertex);
                }
           }
           helper(vertex);  
           return res;
        }

        DFSIterative(vertex){
            if(!vertex) return null;
            let res = [], visited = new Set(), stack = [];
            let v;
            stack.push(vertex);

            while(stack.length){
                v = stack.pop();
                if(!visited.has(v)) {
                    // mark visit and add to result
                     visited.add(v);
                     res.push(v);

                    for (let neighbour of this.adjacencyList.get(v)){   
                        stack.push(neighbour.vertex)
                    }
                }
            }
            return res;
        }

        BFSIterative(root){
            let q = [], visited = new Set(), result = [];
            let vertex;
            // catalyse
            q.unshift(root);

            while(q.length){
                vertex = q.pop();
                if(!visited.has(vertex)){
                    // visit & add to result
                    visited.add(vertex);
                    result.push(vertex);
                    for (let neighbour of this.adjacencyList.get(vertex)){
                        q.unshift(neighbour.vertex);
                    }
                }
            }
            return result;
        }

        shortestPathUsingDijkstra(startNode, endNode){
            // check existence of startnode & endnode
            if(!this.adjacencyList.has(startNode) || !this.adjacencyList.has(endNode)) return undefined;
            let distances = new Map(), pq = new PriorityQueue(), previous = new Map(),  visited = new Set();
            // initialize with Infinity except startNode (0)
            for (let key of this.adjacencyList.keys()){
                if(key === startNode) {
                    distances.set(key, 0);
                    pq.enQueue(key, 0);
                }
                else {
                    distances.set(key, Infinity);
                    pq.enQueue(key, Infinity);
                } 
                 // initialize with null
                previous.set(key, null);
            }

            let smallest = pq.deQueue();
            // loop until priority queue is not empty
            while(smallest){
                if(visited.has(smallest.val)) {
                    smallest = pq.deQueue();
                    continue;
                };
                if(smallest.val === endNode) return this._calculatePath(previous, startNode, endNode);
                for(let neighbour of this.adjacencyList.get(smallest.val)){
                    // from startNode to current neighbour
                    let distanceFromStart = distances.get(smallest.val) === Infinity ? neighbour.weight : distances.get(smallest.val) + neighbour.weight;
                    // if current distance of neighbor is greater than new distance, update it
                    if(distances.get(neighbour.vertex) > distanceFromStart) {
                        distances.set(neighbour.vertex, distanceFromStart)
                        // update previous object
                        previous.set(neighbour.vertex,smallest.val);
                        // update priority queue
                        pq.enQueue(neighbour.vertex,  distanceFromStart);
                    }
                }
                visited.add(smallest.val);
                smallest = pq.deQueue();
            }
            return this._calculatePath(previous, startNode, endNode);
        }

        _calculatePath(prev, start, end){
            let current = end, res = [];
            // traverse from end node to start node
            while(current !== start){
                res.push(current);
                current = prev.get(current);
            }
            res.push(current);
            return res.reverse();
        }
    }

    let g = new WeightedGraph(); 
    g.addVertex('A');
    g.addVertex('B');
    g.addVertex('C');
    g.addVertex('D');
    g.addVertex('E');
    g.addVertex('F');

    g.addEdge('A','B', 4)
    g.addEdge('A','C', 2)
    g.addEdge('B','E', 3)
    g.addEdge('C','D', 2)
    g.addEdge('C','F', 4)
    g.addEdge('D','E', 3)
    g.addEdge('D','F', 1)
    g.addEdge('E','F', 1)

    g.shortestPathUsingDijkstra('A', 'E')
//     g.shortestPathUsingDijkstra('D', 'D')

//     let pq = new PriorityQueue();
//     g.DFSRecursive('A')
//     g.DFSIterative('A')
//     g.BFSIterative('A');
}
