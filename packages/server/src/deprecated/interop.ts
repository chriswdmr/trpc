import { Procedure as NewProcedure } from '../core/procedure';
import { Router as NewRouter } from '../core/router';
import {
  AnyRouter as AnyOldRouter,
  Router as OldRouter,
} from '../deprecated/router';
import { TRPCErrorShape } from '../rpc';
import { CombinedDataTransformer } from '../transformer';
import { Procedure as OldProcedure } from './internals/procedure';
import { ProcedureRecord } from './router';

type MigrateProcedure<
  TProcedure extends OldProcedure<any, any, any, any, any, any, any, any>,
> = TProcedure extends OldProcedure<
  infer TInputContext,
  infer TContext,
  infer TMeta,
  infer TInput,
  infer TParsedInput,
  infer TOutput,
  infer _TParsedOutput,
  infer TFinalInput
>
  ? NewProcedure<{
      _ctx_in: TInputContext;
      _ctx_out: TContext;
      _meta: TMeta;
      _input_in: TInput;
      _input_out: TParsedInput;
      _output_in: TOutput;
      _output_out: TFinalInput;
    }>
  : null;

export type MigrateProcedureRecord<T extends ProcedureRecord<any>> = {
  [K in keyof T]: MigrateProcedure<T[K]>;
};

export type MigrateRouter<
  TInputContext,
  TContext,
  TMeta extends Record<string, any>,
  TQueries extends ProcedureRecord<
    TInputContext,
    TContext,
    any,
    any,
    any,
    any,
    any
  >,
  TMutations extends ProcedureRecord<
    TInputContext,
    TContext,
    any,
    any,
    any,
    any,
    any
  >,
  TSubscriptions extends ProcedureRecord<
    TInputContext,
    TContext,
    unknown,
    unknown,
    any,
    unknown,
    unknown
  >,
  TErrorShape extends TRPCErrorShape<number>,
> = NewRouter<{
  _ctx: TInputContext;
  _errorShape: TErrorShape;
  _meta: TMeta;
  errorFormatter: never;
  mutations: MigrateProcedureRecord<TMutations>;
  queries: MigrateProcedureRecord<TQueries>;
  subscriptions: MigrateProcedureRecord<TSubscriptions>;
  transformer: CombinedDataTransformer;
}>;

export type MigrateOldRouter<TRouter extends AnyOldRouter> =
  TRouter extends OldRouter<
    infer TInputContext,
    infer TContext,
    infer TMeta,
    infer TQueries,
    infer TMutations,
    infer TSubscriptions,
    infer TErrorShape
  >
    ? MigrateRouter<
        TInputContext,
        TContext,
        TMeta,
        TQueries,
        TMutations,
        TSubscriptions,
        TErrorShape
      >
    : never;