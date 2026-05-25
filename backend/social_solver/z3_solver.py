"""
Z3-based SAT solver module for the k-clique problem.

This module provides the necessary functions to encode a graph's topology and 
a target clique size 'k' into a Boolean Satisfiability (SAT) problem using 
Conjunctive Normal Form (CNF) clauses, which are then evaluated via the Z3 solver.
"""

from z3 import Bool, Not, Or, Solver, is_true, sat

SAT_SOLVER = "z3"

g_var_number_to_name = ["invalid"]
g_var_name_to_number = {}


def reset_globals():
    """
    Clears the global variable mappings.
    Must be called before processing a new graph instance to prevent variable collision.
    """
    global g_var_number_to_name, g_var_name_to_number
    g_var_number_to_name = ["invalid"]
    g_var_name_to_number = {}


def closed_range(start, stop, step=1):
    """
    Generates a sequence of integers from start to stop, inclusive.

    Args:
        start (int): The starting integer.
        stop (int): The ending integer (included in the output).
        step (int): The step size. Defaults to 1.

    Returns:
        range: An inclusive range object.
    """
    _dir = 1 if (step > 0) else -1
    return range(start, stop + _dir, step)


def var_count():
    """
    Retrieves the total number of registered Boolean variables.

    Returns:
        int: The current variable count.
    """
    return len(g_var_number_to_name) - 1


def all_var_numbers():
    """
    Retrieves an iterable of all active variable integer identifiers.

    Returns:
        range: The range of valid variable identifiers.
    """
    return closed_range(1, var_count())


def var_number_to_name(num):
    """
    Maps an integer identifier back to its string variable name.

    Args:
        num (int): The variable's integer identifier.

    Returns:
        str: The string representation of the variable.
    """
    return g_var_number_to_name[num]


def var_name_to_number(name):
    """
    Maps a string variable name to its internal integer identifier.

    Args:
        name (str): The string representation of the variable.

    Returns:
        int: The internal integer identifier.
    """
    return g_var_name_to_number[name]


def add_var_name(name):
    """
    Registers a new Boolean variable name into the global state.

    Args:
        name (str): The string identifier for the new variable.
    """
    g_var_number_to_name.append(name)
    g_var_name_to_number[name] = var_count()


def get_var_number(**kwargs):
    """
    Retrieves the integer identifier for a specific vertex-position mapping.

    Returns:
        int: The mapped integer identifier.
    """
    return var_name_to_number(get_var_name(**kwargs))


def get_var_name(**kwargs):
    """
    Constructs the standard string identifier for a vertex at a specific clique index.

    Keyword Args:
        idx (int): The position index within the target clique.
        v (int): The vertex ID from the graph.

    Returns:
        str: Formatted string representing the vertex placement (e.g., 'inClique(1,5)').
    """
    return "inClique(%d,%d)" % (kwargs['idx'], kwargs['v'])


def gen_var_names(**kwargs):
    """
    Initializes all possible Boolean variables for the graph and target clique size.

    Keyword Args:
        n (int): Total number of vertices in the graph.
        k (int): Target clique size.
    """
    n, k = kwargs['n'], kwargs['k']
    for i in closed_range(1, k):
        for v in closed_range(1, n):
            add_var_name(get_var_name(idx=i, v=v))


def gen_clauses(**kwargs):
    """
    Generates the CNF clauses required to represent the k-clique constraints.

    Keyword Args:
        n (int): Total number of vertices in the graph.
        k (int): Target clique size.
        edges (list of tuple): List of undirected edges present in the graph.

    Returns:
        list of list: A collection of CNF clauses, where each clause is a list of integers.
    """
    n, k, edges = kwargs['n'], kwargs['k'], kwargs['edges']
    clauses = []
    non_edges = set()

    for u in closed_range(1, n):
        for v in closed_range(u + 1, n):
            if (u, v) not in edges and (v, u) not in edges:
                non_edges.add((u, v))

    # C1: Each position in the clique must contain at least one vertex
    for i in closed_range(1, k):
        clauses.append([get_var_number(idx=i, v=v) for v in closed_range(1, n)])

    # C2: A position in the clique cannot contain more than one vertex
    for i in closed_range(1, k):
        for u in closed_range(1, n):
            for v in closed_range(u + 1, n):
                clauses.append([-get_var_number(idx=i, v=u), -get_var_number(idx=i, v=v)])

    # C4: Non-adjacent vertices cannot coexist within the clique
    for (u, v) in non_edges:
        for i in closed_range(1, k):
            for j in closed_range(i + 1, k):
                # Append constraints for both index combinations to ensure coverage
                clauses.append([-get_var_number(idx=i, v=u), -get_var_number(idx=j, v=v)])
                clauses.append([-get_var_number(idx=i, v=v), -get_var_number(idx=j, v=u)])

    # C5: Symmetry breaking (Strict ordering of vertex IDs to prevent permutations)
    for i in closed_range(1, k - 1):
        for u in closed_range(1, n):
            for v in closed_range(1, u):
                clauses.append([-get_var_number(idx=i, v=u), -get_var_number(idx=i + 1, v=v)])

    return clauses


def get_dimacs_header(clauses):
    """
    Generates the header required for standard DIMACS CNF files.

    Args:
        clauses (list): The list of generated clauses.

    Returns:
        str: Formatted DIMACS header string.
    """
    return "p cnf %d %d" % (var_count(), len(clauses))


def to_dimacs_cnf(clauses):
    """
    Converts internal clause representations into a DIMACS CNF formatted string.

    Args:
        clauses (list of list): The collection of CNF clauses.

    Returns:
        str: Multiline string representation of the clauses.
    """
    return "\n".join([" ".join(map(str, x)) + " 0" for x in clauses])


def solve_clauses(clauses):
    """
    Evaluates the provided CNF clauses using the Z3 Theorem Prover.

    Args:
        clauses (list of list): The collection of CNF clauses.

    Returns:
        list of int: The list of variable identifiers that satisfy the clauses (representing the clique),
                     or None if the problem is unsatisfiable.
    """
    vars_by_number = {n: Bool(var_number_to_name(n)) for n in all_var_numbers()}
    s = Solver()

    for clause in clauses:
        z3_clause = []
        for lit in clause:
            var = vars_by_number[abs(lit)]
            z3_clause.append(var if lit > 0 else Not(var))
        s.add(Or(z3_clause))

    if s.check() != sat:
        return None

    m = s.model()
    return [n for n in all_var_numbers() if is_true(m.evaluate(vars_by_number[n], model_completion=True))]