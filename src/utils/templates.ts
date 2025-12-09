// Poem templates
import type { PoemTemplate } from '../types';

export const poemTemplates: PoemTemplate[] = [
  {
    id: 'haiku',
    name: 'Haiku',
    description: '5-7-5 syllable structure',
    structure: 'Line 1: 5 syllables\nLine 2: 7 syllables\nLine 3: 5 syllables',
    example: 'An old silent pond\nA frog jumps into the pond—\nSplash! Silence again.'
  },
  {
    id: 'sonnet',
    name: 'Sonnet',
    description: '14 lines, ABAB CDCD EFEF GG rhyme scheme',
    structure: '14 lines total\n3 quatrains (4 lines each)\n1 couplet (2 lines)',
    example: 'Shall I compare thee to a summer\'s day?\nThou art more lovely and more temperate...'
  },
  {
    id: 'limerick',
    name: 'Limerick',
    description: '5 lines, AABBA rhyme scheme',
    structure: 'Line 1: A (8-9 syllables)\nLine 2: A (8-9 syllables)\nLine 3: B (5-6 syllables)\nLine 4: B (5-6 syllables)\nLine 5: A (8-9 syllables)',
    example: 'There once was a man from Peru\nWho dreamed he was eating his shoe\nHe woke with a fright\nIn the middle of the night\nTo find that his dream had come true.'
  },
  {
    id: 'free-verse',
    name: 'Free Verse',
    description: 'No specific structure or rhyme scheme',
    structure: 'Write freely without constraints\nFocus on imagery and emotion\nExperiment with line breaks',
    example: 'The fog comes\non little cat feet.\nIt sits looking\nover harbor and city\non silent haunches\nand then moves on.'
  },
  {
    id: 'acrostic',
    name: 'Acrostic',
    description: 'First letter of each line spells a word',
    structure: 'Choose a word\nEach line starts with successive letters\nLines can be any length',
    example: 'P oetry flows like a river\nO ver mountains and through valleys\nE very word a stepping stone\nT o understanding and beauty'
  },
  {
    id: 'tanka',
    name: 'Tanka',
    description: '5-7-5-7-7 syllable structure',
    structure: 'Line 1: 5 syllables\nLine 2: 7 syllables\nLine 3: 5 syllables\nLine 4: 7 syllables\nLine 5: 7 syllables',
    example: 'The falling flower\nI saw drift back to the branch\nWas a butterfly\nFluttering wings in the breeze\nDancing through the summer air'
  }
];

export const getTemplateById = (id: string): PoemTemplate | undefined => {
  return poemTemplates.find(t => t.id === id);
};
