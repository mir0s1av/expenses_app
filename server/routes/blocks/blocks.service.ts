import { db } from '@/server/db';
import { SHA256 } from 'bun';
import { selectBlockSchema } from '../../db/schema/blocks.schema';
import { blocksTable, type BlockType } from "@/server/db/schema/blocks.schema";

type HashPayload = {
  index: number;
  createdAt: Date;
  payload: string;
  previousHash: string;
};

export default {
  calculateHash({ index, createdAt, payload, previousHash }: HashPayload) {
    return new SHA256()
      .update(index + previousHash + payload + createdAt.toISOString())
      .toString();
  },

  async isChainValid() {
    const chain = await db
      .select()
      .from(blocksTable)
      .prepare("allBlocks")
      .execute();

    for (let i = 1; i < chain.length; i++) {
      const cb = chain[i];
      const pvb = chain[i - 1];

      if (
        cb.hash !== this.calculateHash({ ...cb, index: cb.id }) ||
        pvb.hash !== cb.previousHash
      ) {
        return false;
      }
    }
    return true;
  },

  mine(difficulty: number, block: BlockType) {
    while (
      block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      block.nonce++;
      block.hash = this.calculateHash({ index: block.id, ...block });
    }
  },
};
