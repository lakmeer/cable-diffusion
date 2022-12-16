

  // @ts-nocheck

  import jsonData from "../data/basic.graph.json";

  const uid = (() => { let i = 0; return () => i++; })();

  import {
    Engine,
    Registry,
    ManualLifecycleEventEmitter,
    readGraphFromJSON,
    registerCoreProfile,
    validateGraph,
    validateRegistry,
  } from '@behave-graph/core';

  import type { ILogger, } from '@behave-graph/core';


  // Custom logger

  class RecordLogger implements ILogger {

    constructor() {
      this.record = [];
    }

    verbose (text: string): void { this.record.push(["[V]", text]); }
    info    (text: string): void { this.record.push(["[I]", text]); }
    warn    (text: string): void { this.record.push(["[W]", text]); }
    error   (text: string): void { this.record.push(["[E]", text]); }

    dump (): void {
      console.group("Dumping log records:");
      this.record.forEach((r) => {
        let color:string;
        switch (r[0]) {
          case "[V]": color = "gray";   break;
          case "[I]": color = "green";  break;
          case "[W]": color = "yellow"; break;
          case "[E]": color = "red";    break;
        }
        console.log("%c" + r[0], "color: " + color, r[1]);
      });
      console.groupEnd();
    };
  }


  // Build graph

  const registry = new Registry();
  const logger = new RecordLogger();
  const events = new ManualLifecycleEventEmitter();

  registerCoreProfile(registry, logger, events);


  export const behaveToFlow = (graph): { nodes: [], edges: [] } => {
    const nodes = [];
    const edges = [];

    graph.nodes?.forEach((nodeJSON) => {
      const node = {
        id: nodeJSON.id,
        type: nodeJSON.type,
        position: {
          x: nodeJSON.metadata?.positionX ? Number(nodeJSON.metadata?.positionX) : 0,
          y: nodeJSON.metadata?.positionY ? Number(nodeJSON.metadata?.positionY) : 0,
        },
        data: {}
      };

      nodes.push(node);

      if (nodeJSON.parameters) {
        for (const [inputKey, input] of Object.entries(nodeJSON.parameters)) {
          if ("link" in input && input.link !== undefined) {
            edges.push({
              id: uid(),
              source: input.link.nodeId,
              sourceHandle: input.link.socket,
              target: nodeJSON.id,
              targetHandle: inputKey,
            });
          }

          if ("value" in input) {
            node.data[inputKey] = input.value;
          }
        }
      }

      if (nodeJSON.flows) {
        for (const [inputKey, link] of Object.entries(nodeJSON.flows)) {
          edges.push({
            id: uid(),
            source: nodeJSON.id,
            sourceHandle: inputKey,
            target: link.nodeId,
            targetHandle: link.socket,
          });
        }
      }
    });

    return { nodes, edges };
  };


  // Execute graph

  const execGraph = async () => {

    const graph = readGraphFromJSON(jsonData, registry);

    const errors = [ ...validateRegistry(registry), ...validateGraph(graph) ];
    if (errors.length) console.warn(errors);

    console.group("Graph details...");
    console.log(graph);

    Object.entries(graph.nodes).forEach((node) => {
      console.log(node);
    });

    const engine = new Engine(graph);
    events.startEvent.emit();
    await engine.executeAllAsync(5);

    engine.dispose();
    logger.dump();

    console.groupEnd();
  }

  const theGraph = behaveToFlow(jsonData);
  execGraph();


  export { execGraph };
  export default theGraph;


  export const writeMetadata = (node, metadata) => {

  }

  export const writePortData = (node, port, data) => {

  }

