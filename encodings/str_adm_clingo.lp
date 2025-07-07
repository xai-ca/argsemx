%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Encoding for strongly admissible sets
% from Database and Artificial Intelligence Group at TU Wien
% https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung.html
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% Guess extension
in(X) :- arg(X), not out(X).
out(X):- arg(X), not in(X).

%% Compute restricted fixed-point
fixedPoint(X) :- in(X), defeated(Y):att(Y,X).
defeated(X):-arg(X), fixedPoint(Y), att(Y,X).

%% Compare fixed-point and guess
:- in(X), not fixedPoint(X).