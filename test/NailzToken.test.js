const NailzToken = artifacts.require("./NailzToken");

require("chai").use(require("chai-as-promised")).should();

contract("NalizToken", ([deployer, receiver, exchange]) => {
  const EVM_REVERT = "VM Exception while processing transaction: revert";
  const name = "Nailz";
  const symbol = "NLZ";
  const decimals = "9";
  const totalSupply = "101988000000000";
  let nalizToken;

  beforeEach(async () => {
    nailzToken = await NailzToken.new();
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      const result = await nailzToken.name();
      result.should.equal(name);
    });

    it("tracks the symbol", async () => {
      const result = await nailzToken.symbol();
      result.should.equal(symbol);
    });

    it("tracks the decimals", async () => {
      const result = await nailzToken.decimals();
      result.toString().should.equal(decimals);
    });

    it("tracks the total supply", async () => {
      const result = await nailzToken.totalSupply();
      result.toString().should.equal(totalSupply);
    });

    it("assigns the total supply to the deployer", async () => {
      const result = await nailzToken.balanceOf(deployer);
      result.toString().should.equal(totalSupply);
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount;

    describe("success", async () => {
      beforeEach(async () => {
        amount = "100";
        result = await nailzToken.transfer(receiver, amount);
      });

      it("transfers token balances", async () => {
        let balanceOf;
        balanceOf = await nailzToken.balanceOf(deployer);
        balanceOf.toString().should.equal("101987999999900");
        balanceOf = await nailzToken.balanceOf(receiver);
        balanceOf.toString().should.equal("100");
      });

      it("emits a Transfer event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "deployer is Not correct");
        event.to.should.equal(receiver, "receiver is Not correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is Not correct");
      });

    });
    describe("failure", async () => {
      it("rejects insufficient balances", async () => {
        let invalidAmount;
        invalidAmount = "1000000000000000000"; // 100 million - greater than total supply
        await nailzToken.transfer(
          receiver,
          invalidAmount
        ).should.be.rejectedWith(EVM_REVERT);

        // Attempt transfer tokens, when you have none
        invalidAmount = "10"; // recipient has no tokens
        await nailzToken.transfer(deployer, invalidAmount, {
          from: receiver,
        }).should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", async () => {
        await nailzToken.transfer(0x0, amount, { from: deployer }).should.be
          .rejected;
      });
    });
  });

  describe("approving tokens", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = "100";
      result = await nailzToken.approve(exchange, amount, { from: deployer });
    });

    describe("success", () => {
      it("allocates an allowance for delegated token spending on exchange", async () => {
        const allowance = await nailzToken.allowance(deployer, exchange);
        allowance.toString().should.equal(amount);
      });

      it("emits an Approval event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Approval");
        const event = log.args;
        event.owner.toString().should.equal(deployer, "owner is Not correct");
        event.spender.should.equal(exchange, "spender is Not correct");
        event.value
          .toString()
          .should.equal(amount, "value is Not correct");
      });
    });

    describe("failure", () => {
      it("rejects invalid spenders", async () => {
        await nailzToken.approve(0x0, amount, { from: deployer }).should.be.rejected;
      });
    });
  });

  describe("delegated token transfers", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = "100";
      await nailzToken.approve(exchange, amount, { from: deployer });
    });

    describe("success", async () => {
      beforeEach(async () => {
        result = await nailzToken.transferFrom(deployer, receiver, amount, {
          from: exchange,
        });
      });

      it("transfers token balances", async () => {
        let balanceOf;
        balanceOf = await nailzToken.balanceOf(deployer);
        balanceOf.toString().should.equal("101987999999900".toString());
        balanceOf = await nailzToken.balanceOf(receiver);
        balanceOf.toString().should.equal("100".toString());
      });

      it("resets the allowance", async () => {
        const allowance = await nailzToken.allowance(deployer, exchange);
        allowance.toString().should.equal("0");
      });

      it("emits a Transfer event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount, "value is correct");
      });
    });

    describe("failure", async () => {
      it("rejects insufficient amounts", async () => {
        // Attempt transfer too many tokens
        const invalidAmount = "100000000000";
        await nailzToken
          .transferFrom(deployer, receiver, invalidAmount, { from: exchange })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", async () => {
        await nailzToken.transferFrom(deployer, 0x0, amount, { from: exchange })
          .should.be.rejected;
      });
    });
  });
});
