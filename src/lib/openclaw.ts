/**
 * OpenClaw 客户端
 * 用于与 OpenClaw Gateway 通信
 */

import WebSocket from 'ws';

export interface OpenClawConfig {
  url: string;
  token: string;
}

export interface OpenClawMessage {
  type: 'req' | 'resp' | 'event';
  id?: string;
  method?: string;
  params?: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private config: OpenClawConfig;
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = new Map();
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(config: OpenClawConfig) {
    this.config = config;
  }

  /**
   * 连接到 OpenClaw Gateway
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.on('open', () => {
          console.log('OpenClaw WebSocket connected');
          resolve();
        });

        this.ws.on('message', (data: Buffer) => {
          this.handleMessage(data.toString());
        });

        this.ws.on('error', (error) => {
          console.error('OpenClaw WebSocket error:', error);
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('OpenClaw WebSocket closed');
          // 自动重连
          setTimeout(() => this.connect(), 5000);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.type === 'resp' && message.id) {
        // 处理响应
        const pending = this.pendingRequests.get(message.id);
        if (pending) {
          if (message.error) {
            pending.reject(message.error);
          } else {
            pending.resolve(message.result);
          }
          this.pendingRequests.delete(message.id);
        }
      } else if (message.type === 'event') {
        // 处理事件
        const handler = this.messageHandlers.get(message.event || 'default');
        if (handler) {
          handler(message.data);
        }
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * 发送消息并等待响应
   */
  private sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.pendingRequests.set(id, { resolve, reject });

      const message: OpenClawMessage = {
        type: 'req',
        id,
        method,
        params,
      };

      this.ws.send(JSON.stringify(message));

      // 超时处理
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 60000);
    });
  }

  /**
   * 发送聊天消息
   */
  async chat(message: string, sessionKey?: string): Promise<string> {
    return this.sendRequest('agent/chat', {
      message,
      sessionKey: sessionKey || 'default',
    });
  }

  /**
   * 执行技能
   */
  async executeSkill(skillName: string, params: any): Promise<any> {
    return this.sendRequest('skill/execute', {
      skill: skillName,
      ...params,
    });
  }

  /**
   * 布局生成
   */
  async generateLayout(layoutData: any, requirements: any): Promise<any> {
    return this.executeSkill('layout-generator', {
      layoutData,
      requirements,
    });
  }

  /**
   * 效果图生成
   */
  async generateRendering(layoutData: any, style: string): Promise<any> {
    return this.executeSkill('rendering-generator', {
      layoutData,
      style,
    });
  }

  /**
   * 户型识别
   */
  async recognizeLayout(imageUrl: string): Promise<any> {
    return this.executeSkill('layout-recognizer', {
      imageUrl,
    });
  }

  /**
   * 材料推荐
   */
  async recommendMaterials(requirements: any): Promise<any> {
    return this.executeSkill('material-advisor', {
      ...requirements,
    });
  }

  /**
   * 预算计算
   */
  async calculateBudget(projectData: any): Promise<any> {
    return this.executeSkill('budget-calculator', {
      ...projectData,
    });
  }

  /**
   * 订阅事件
   */
  on(event: string, handler: (data: any) => void): void {
    this.messageHandlers.set(event, handler);
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// 创建单例
let openclawClient: OpenClawClient | null = null;

export function getOpenClawClient(): OpenClawClient {
  if (!openclawClient) {
    openclawClient = new OpenClawClient({
      url: process.env.OPENCLAW_URL || 'ws://localhost:18789',
      token: process.env.OPENCLAW_TOKEN || '',
    });
  }
  return openclawClient;
}

export const openclaw = getOpenClawClient();
