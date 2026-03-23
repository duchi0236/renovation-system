/**
 * A2A Protocol 客户端
 * Agent-to-Agent 通信协议
 */

export interface A2AMessage {
  jsonrpc: '2.0';
  id: string;
  method?: string;
  params?: any;
  result?: any;
  error?: A2AError;
}

export interface A2AError {
  code: number;
  message: string;
  data?: any;
}

export interface AgentTask {
  taskId?: string;
  sessionId?: string;
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  context?: Record<string, any>;
  metadata?: {
    taskType?: string;
    priority?: 'low' | 'normal' | 'high';
    deadline?: string;
  };
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  endpoint: string;
}

export class A2AClient {
  private baseUrl: string;
  private apiKey: string;
  private agentRegistry: Map<string, AgentInfo> = new Map();

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * 发送任务给指定 Agent
   */
  async sendTask(agentId: string, task: AgentTask): Promise<any> {
    const agent = this.agentRegistry.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const response = await fetch(`${agent.endpoint}/a2a/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `req_${Date.now()}`,
        method: 'tasks/send',
        params: {
          sessionId: task.sessionId,
          message: task.message,
          metadata: task.metadata,
        },
      }),
    });

    return response.json();
  }

  /**
   * 获取任务状态
   */
  async getTaskStatus(taskId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/a2a/tasks/${taskId}/status`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    return response.json();
  }

  /**
   * 发现可用 Agents
   */
  async discoverAgents(capability?: string): Promise<AgentInfo[]> {
    const url = capability 
      ? `${this.baseUrl}/a2a/agents?capability=${capability}`
      : `${this.baseUrl}/a2a/agents`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();
    return data.agents || [];
  }

  /**
   * 注册 Agent
   */
  async registerAgent(agent: AgentInfo): Promise<void> {
    this.agentRegistry.set(agent.id, agent);
  }

  /**
   * 批量发送任务
   */
  async broadcast(agentIds: string[], task: Omit<AgentTask, 'sessionId'>): Promise<any[]> {
    return Promise.all(
      agentIds.map(agentId => this.sendTask(agentId, task))
    );
  }
}

/**
 * Agent 工厂
 * 创建装修相关的专业 Agents
 */
export class RenovationAgentFactory {
  private a2aClient: A2AClient;

  constructor(a2aClient: A2AClient) {
    this.a2aClient = a2aClient;
  }

  /**
   * 创建需求分析 Agent
   */
  createDemandAnalyzer(): AgentInfo {
    return {
      id: 'demand_analyzer',
      name: '需求分析师',
      description: '分析用户装修需求，提取关键信息',
      capabilities: ['nlp', 'intent_recognition', 'entity_extraction'],
      endpoint: process.env.AGENT_DEMAND_ANALYZER_URL || 'http://localhost:3001',
    };
  }

  /**
   * 创建布局设计 Agent
   */
  createLayoutDesigner(): AgentInfo {
    return {
      id: 'layout_designer',
      name: '布局设计师',
      description: '根据户型和需求生成布局方案',
      capabilities: ['layout_generation', 'space_planning'],
      endpoint: process.env.AGENT_LAYOUT_DESIGNER_URL || 'http://localhost:3002',
    };
  }

  /**
   * 创建效果图生成 Agent
   */
  createRenderingAgent(): AgentInfo {
    return {
      id: 'rendering_agent',
      name: '效果图生成 Agent',
      description: '生成室内装修效果图',
      capabilities: ['image_generation', 'style_transfer'],
      endpoint: process.env.AGENT_RENDERING_URL || 'http://localhost:3003',
    };
  }

  /**
   * 创建材料推荐 Agent
   */
  createMaterialAdvisor(): AgentInfo {
    return {
      id: 'material_advisor',
      name: '材料管家',
      description: '推荐装修材料，提供价格信息',
      capabilities: ['product_search', 'price_comparison'],
      endpoint: process.env.AGENT_MATERIAL_URL || 'http://localhost:3004',
    };
  }

  /**
   * 创建施工监理 Agent
   */
  createSupervisor(): AgentInfo {
    return {
      id: 'construction_supervisor',
      name: '监理工程师',
      description: '监控施工质量，生成监理报告',
      capabilities: ['image_recognition', 'quality_check'],
      endpoint: process.env.AGENT_SUPERVISOR_URL || 'http://localhost:3005',
    };
  }

  /**
   * 注册所有 Agents
   */
  async registerAll(): Promise<void> {
    const agents = [
      this.createDemandAnalyzer(),
      this.createLayoutDesigner(),
      this.createRenderingAgent(),
      this.createMaterialAdvisor(),
      this.createSupervisor(),
    ];

    for (const agent of agents) {
      await this.a2aClient.registerAgent(agent);
    }
  }
}

// 单例
let a2aClientInstance: A2AClient | null = null;

export function getA2AClient(): A2AClient {
  if (!a2aClientInstance) {
    a2aClientInstance = new A2AClient(
      process.env.A2A_SERVER_URL || 'http://localhost:8080',
      process.env.A2A_API_KEY || ''
    );
  }
  return a2aClientInstance;
}

export function getRenovationAgentFactory(): RenovationAgentFactory {
  return new RenovationAgentFactory(getA2AClient());
}
