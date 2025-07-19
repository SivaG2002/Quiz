
"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Home } from 'lucide-react';
import React from 'react';
import UserProfile from '@/components/UserProfile';
import { useToast } from '@/hooks/use-toast';

const GAME_DURATION = 60; // seconds
const TEST_MODE_TIMEOUT = 5000; // 5 seconds
const USERNAME_KEY = "mathverse-username";

interface Problem {
  question: string;
  options: number[];
  answer: number;
}

function getGameTitle(mode: string) {
    switch (mode) {
      case 'addition': return 'Addition';
      case 'subtraction': return 'Subtraction';
      case 'multiplication': return 'Multiplication';
      case 'squared': return 'Squared';
      case 'cubes': return 'Cubes';
      case 'square-roots': return 'Square Roots';
      default: return '';
    }
}

// A simple non-crypto hash for seeding randomness
function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}



function GameClientContent({ mode, level }: { mode: string, level: string }) {
  const searchParams = useSearchParams();
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 15;
  const { toast } = useToast();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [problemCount, setProblemCount] = useState(0);
  
  const nextProblemTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateProblem = useCallback(() => {
    let seed = simpleHash(`${mode}-${level}-${problemCount}-${limit}`);
    const random = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    let question = '';
    let answer = 0;
    let num1: number, num2: number;

    switch (mode) {
      case 'addition':
        num1 = Math.floor(random() * 20) + 1;
        num2 = Math.floor(random() * 20) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case 'subtraction':
        num1 = Math.floor(random() * 20) + 1;
        num2 = Math.floor(random() * 20) + 1;
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        num1 = Math.floor(random() * 10) + 2;
        num2 = Math.floor(random() * 10) + 2;
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'squared':
        num1 = Math.floor(random() * (limit - 1)) + 2;
        answer = num1 * num1;
        question = `${num1}² = ?`;
        break;
      case 'cubes':
        num1 = Math.floor(random() * (limit - 1)) + 2;
        answer = num1 * num1 * num1;
        question = `${num1}³ = ?`;
        break;
      case 'square-roots':
        num1 = Math.floor(random() * (limit - 1)) + 2;
        answer = num1;
        question = `√${num1*num1} = ?`;
        break;
    }

    const options = new Set<number>();
    options.add(answer);
    while (options.size < 4) {
      const offset = Math.floor(random() * 10) - 5;
      const randomOffset = offset === 0 ? 1 : offset;
      const option = answer + randomOffset;
      if (option >= 0) {
        options.add(option);
      }
    }
    
    setSelectedOption(null);
    setIsCorrect(null);
    setProblem({ question, options: Array.from(options).sort(() => random() - 0.5), answer });
    setProblemCount(prev => prev + 1);
  }, [mode, level, problemCount, limit]);
  
  const goToNextProblem = useCallback(() => {
     if (isGameActive) {
        generateProblem();
     }
  }, [isGameActive, generateProblem]);

  const handleAnswer = useCallback((option: number, timedOut = false) => {
    if (selectedOption !== null || !problem) return;
    if (testModeTimeoutRef.current) clearTimeout(testModeTimeoutRef.current);
    
    const correct = option === problem.answer;
    
    setSelectedOption(option);
    setIsCorrect(correct);

    if (correct && !timedOut) {
      setScore(s => s + 1);
    }
    
    const delay = correct ? 500 : 1000;
    const timeoutDuration = timedOut ? 1500 : delay;

    nextProblemTimeoutRef.current = setTimeout(goToNextProblem, timeoutDuration);
  }, [selectedOption, problem, goToNextProblem]);

  useEffect(() => {
    if(!isGameActive) return;
    generateProblem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameActive]);
  
  // Effect for test mode timeout
  useEffect(() => {
    if (level === 'test' && problem && isGameActive) {
      if (testModeTimeoutRef.current) clearTimeout(testModeTimeoutRef.current);
      testModeTimeoutRef.current = setTimeout(() => {
        handleAnswer(NaN, true);
      }, TEST_MODE_TIMEOUT);
    }
    
    return () => {
      if (testModeTimeoutRef.current) clearTimeout(testModeTimeoutRef.current);
    }
  }, [problem, level, isGameActive, handleAnswer]);


  useEffect(() => {
    if (level !== 'competitive' || !isGameActive) return;

    if (timeLeft <= 0) {
      setIsGameActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, level, isGameActive]);

  useEffect(() => {
    return () => { // Cleanup timeouts on component unmount
      if (nextProblemTimeoutRef.current) clearTimeout(nextProblemTimeoutRef.current);
      if (testModeTimeoutRef.current) clearTimeout(testModeTimeoutRef.current);
    }
  }, []);

  // Effect to send score when game ends
  useEffect(() => {
    if (!isGameActive) {
      const sendScore = async () => {
        const username = localStorage.getItem(USERNAME_KEY) || "Guest";
        try {
          // Use the internal API proxy route
          const response = await fetch('/api/submit-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, score }),
          });

          if (response.ok) {
            toast({
              title: "Score Submitted",
              description: "Your score was sent successfully.",
            });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit score');
          }
        } catch (error) {
          console.error("Error submitting score:", error);
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "Could not send score to the server.",
          });
        }
      };
      
      sendScore();
    }
  }, [isGameActive, score, toast]);
  
  const title = `${getGameTitle(mode)} - ${level === 'competitive' ? 'Competitive' : 'Test'} Level`;

  const validModes = ['addition', 'subtraction', 'multiplication', 'squared', 'cubes', 'square-roots'];
  const validLevels = ['test', 'competitive'];
  if (!validModes.includes(mode) || !validLevels.includes(level)) {
    notFound();
  }


  if (!isGameActive) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Game Over!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-xl text-muted-foreground">You scored:</p>
                    <p className="text-6xl font-bold text-primary">{score}</p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => window.location.reload()}>Play Again</Button>
                        <Button variant="outline" asChild>
                           <Link href="/">
                                <Home className="mr-2" /> Go Home
                           </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
  }

  if (!problem) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <p>Loading...</p>
        </main>
    );
  }

  const timerColor = timeLeft <= 10 ? 'border-red-500' : 'border-green-500';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-headline pt-2">{title}</CardTitle>
            <div className='flex items-center gap-4'>
                {level === 'competitive' && (
                    <div className={cn("text-2xl font-bold border-4 rounded-full size-20 flex items-center justify-center transition-colors", timerColor)}>
                        {timeLeft}
                    </div>
                )}
                <UserProfile />
            </div>
          </div>
          {level === 'competitive' && (
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="mt-2" />
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[20rem]">
            <div className="text-5xl font-bold tracking-wider text-center">
                {problem.question}
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {problem.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isTheCorrectAnswer = problem.answer === option;
                    const answerRevealed = selectedOption !== null;

                    let buttonColor = 'bg-secondary';
                    if (answerRevealed) {
                        if (isTheCorrectAnswer) {
                            buttonColor = 'bg-green-500/80 border-green-400';
                        } else if (isSelected) {
                            buttonColor = 'bg-red-500/80 border-red-400';
                        }
                    }

                    return (
                        <Button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={answerRevealed}
                            className={cn("h-24 text-4xl font-bold transform transition-all", buttonColor, "hover:bg-primary/80")}
                        >
                            {option}
                        </Button>
                    );
                })}
            </div>
             <div className="text-xl font-semibold text-primary">Score: {score}</div>
        </CardContent>
      </Card>
    </main>
  );
}

// This is the main client component which wraps the actual game content in a Suspense boundary
// This is necessary because the game content uses `useSearchParams`, a client-side hook.
export default function GameClientPage({ mode, level }: { mode: string, level: string }) {
  return (
    <Suspense fallback={<main className="flex min-h-screen flex-col items-center justify-center p-8"><p>Loading...</p></main>}>
        <GameClientContent mode={mode} level={level} />
    </Suspense>
  );
}
